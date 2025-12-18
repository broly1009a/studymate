/**
 * StudyMate AI Copilot Chat API
 * 
 * Endpoints:
 * POST /api/ai/chat - Chat with AI (optimized for cost)
 * 
 * Request body:
 * {
 *   message: string;
 *   userId?: string;
 *   sessionId?: string;
 * }
 * 
 * Response:
 * {
 *   response: string;
 *   type: 'answer' | 'action_required';
 *   action?: string; // If type === 'action_required'
 *   metadata?: { tokensUsed, costEstimate }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  STUDYMATE_SYSTEM_PROMPT,
  TEMPLATE_RESPONSES,
  KEYWORD_ROUTING,
  DATA_FETCH_TYPES,
  formatAIResponse,
} from '@/lib/ai-system-prompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Classify user message without calling LLM
 * Returns appropriate template response or action required
 */
function classifyMessage(userMessage: string): {
  type: 'template' | 'llm_required' | 'data_required';
  templateKey?: string;
  dataFetchType?: string;
} {
  const lower = userMessage.toLowerCase();

  // Check for data-dependent questions first
  for (const [category, keywords] of Object.entries(KEYWORD_ROUTING)) {
    if (keywords.some(kw => lower.includes(kw))) {
      // Determine if data fetch is needed
      if (category.startsWith('my_')) {
        return {
          type: 'data_required',
          dataFetchType: DATA_FETCH_TYPES[category.toUpperCase() as keyof typeof DATA_FETCH_TYPES],
        };
      }

      // Otherwise, use template
      const templateKey = category as keyof typeof TEMPLATE_RESPONSES;
      if (TEMPLATE_RESPONSES[templateKey]) {
        return { type: 'template', templateKey };
      }
    }
  }

  // Check if question is completely off-topic
  const studymateMentions = ['studymate', 'khóa học', 'lịch học', 'học tập', 'hệ thống'];
  const hasRelevantKeyword = studymateMentions.some(kw => lower.includes(kw));

  if (!hasRelevantKeyword && lower.length < 50) {
    return { type: 'template', templateKey: 'not_studymate' };
  }

  // Need LLM for complex/specialized questions
  return { type: 'llm_required' };
}

/**
 * Call OpenAI API with cached system prompt (for cost reduction)
 */
async function callOpenAIWithCache(
  userMessage: string
): Promise<{
  response: string;
  inputTokens: number;
  outputTokens: number;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Cost-optimized model: ~$0.15 per 1M input tokens
    max_tokens: 150, // Limit output tokens (max 5 sentences)
    messages: [
      {
        role: 'system',
        content: STUDYMATE_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return {
    response: formatAIResponse(content),
    inputTokens: response.usage?.prompt_tokens || 0,
    outputTokens: response.usage?.completion_tokens || 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: message is required' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Step 1: Classify message
    const classification = classifyMessage(trimmedMessage);

    // Step 2: Handle based on classification
    if (classification.type === 'template') {
      const templateKey = classification.templateKey as keyof typeof TEMPLATE_RESPONSES;
      return NextResponse.json({
        response: TEMPLATE_RESPONSES[templateKey],
        type: 'answer',
        metadata: {
          tokensUsed: 0, // Template responses don't use tokens
          costEstimate: 0,
          source: 'template',
        },
      });
    }

    if (classification.type === 'data_required') {
      return NextResponse.json({
        response: `Tôi cần lấy dữ liệu của bạn từ hệ thống để trả lời chính xác.`,
        type: 'action_required',
        action: `FETCH_DATA[${classification.dataFetchType}]`,
        metadata: {
          dataType: classification.dataFetchType,
          tokensUsed: 0,
        },
      });
    }

    // Step 3: Use LLM for complex questions
    const openaiResult = await callOpenAIWithCache(trimmedMessage);

    const totalTokens = openaiResult.inputTokens + openaiResult.outputTokens;

    // Calculate cost estimate (USD and VND)
    const inputCostPerMillion = 0.15; // USD per 1M input tokens
    const outputCostPerMillion = 0.60; // USD per 1M output tokens
    const estimatedCostUSD = (openaiResult.inputTokens / 1_000_000) * inputCostPerMillion + (openaiResult.outputTokens / 1_000_000) * outputCostPerMillion;
    const estimatedCostVND = estimatedCostUSD * 25000; // Approximate VND per USD

    // Check if LLM returned an action
    if (openaiResult.response.startsWith('ACTION_REQUIRED:')) {
      const action = openaiResult.response.replace('ACTION_REQUIRED: ', '');
      return NextResponse.json({
        response: `Tôi cần lấy dữ liệu của bạn từ hệ thống để trả lời chính xác.`,
        type: 'action_required',
        action: action,
        metadata: {
          tokensUsed: totalTokens,
          costEstimate: estimatedCostUSD,
          costEstimateVND: estimatedCostVND,
          breakdown: {
            inputTokens: openaiResult.inputTokens,
            outputTokens: openaiResult.outputTokens,
          },
        },
      });
    }

    return NextResponse.json({
      response: openaiResult.response,
      type: 'answer',
      metadata: {
        tokensUsed: totalTokens,
        costEstimate: estimatedCostUSD,
        costEstimateVND: estimatedCostVND,
        breakdown: {
          inputTokens: openaiResult.inputTokens,
          outputTokens: openaiResult.outputTokens,
        },
      },
    });
  } catch (error) {
    console.error('AI Chat API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'API key is invalid or missing' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
