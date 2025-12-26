/**
 * useAIChat Hook
 * 
 * Usage:
 * const { response, isLoading, error, sendMessage } = useAIChat();
 * await sendMessage("Khóa học nào phù hợp cho tôi?");
 */

'use client';

import { API_URL } from '@/lib/constants';

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIResponse {
  response: string;
  type: 'answer' | 'action_required';
  action?: string;
  metadata?: {
    tokensUsed: number;
    costEstimate: number;
    source?: string;
    dataType?: string;
  };
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  response: string | null;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('Message cannot be empty');
      return;
    }

    // Add user message to history
    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          sessionId: Date.now().toString(), 
        }),
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data: AIResponse = await result.json();

      // Add assistant message to history
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      setResponse(data.response);

      // Log metadata for monitoring (optional)
      if (data.metadata) {
        console.log('[AI Chat Metrics]', data.metadata);
      }

      // Handle action required (e.g., fetch data)
      if (data.type === 'action_required' && data.action) {
        console.log('[Action Required]', data.action);
        // You can dispatch additional actions here
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI Chat Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setResponse(null);
    setError(null);
  };

  return {
    messages,
    response,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
