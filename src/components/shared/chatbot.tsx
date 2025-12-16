'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { findAnswer } from '@/lib/chatbot-qa';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isAction?: boolean;
  actionType?: string;
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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý AI của StudyMate. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useAIMode, setUseAIMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);
    setIsLoading(true);

    try {
      if (useAIMode) {
        // Call AI API (ChatGPT)
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: currentInput,
            sessionId: Date.now().toString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data: AIResponse = await response.json();

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
          isAction: data.type === 'action_required',
          actionType: data.action,
        };

        setIsTyping(false);
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Use existing Q&A database
        const matchedAnswer = findAnswer(currentInput);

        let responseText: string;

        if (matchedAnswer) {
          responseText = matchedAnswer;
        } else {
          const responses = [
            `Cảm ơn bạn đã chia sẻ! Bạn vừa nói: "${currentInput}". Tôi đã ghi nhận thông tin này và sẽ hỗ trợ bạn tốt nhất có thể!`,
            `Tôi hiểu rồi! Về "${currentInput}" - đây là một câu hỏi hay. Tôi sẽ cố gắng giúp bạn giải quyết vấn đề này!`,
            `Bạn đã nói: "${currentInput}". Đây là một chủ đề thú vị! Hãy cho tôi biết thêm chi tiết để tôi có thể hỗ trợ bạn tốt hơn nhé!`,
            `Cảm ơn bạn! Tôi đã nhận được tin nhắn: "${currentInput}". Tôi luôn sẵn sàng giúp đỡ bạn trong hành trình học tập!`,
          ];
          responseText = responses[Math.floor(Math.random() * responses.length)];
        }

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: 'bot',
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[500px] shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6059f7] to-[#4f47d9] p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="/icon_chatbot.png"
                  alt="ChatBot"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold">StudyMate AI</h3>
                <p className="text-white/80 text-xs">
                  {useAIMode ? '🤖 AI Copilot (ChatGPT)' : '📚 Q&A Mode'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseAIMode(!useAIMode)}
                title={useAIMode ? 'Switch to Q&A' : 'Switch to AI'}
                className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
              >
                {useAIMode ? 'Q&A' : 'AI'}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={cn(
                    'flex',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3',
                      message.sender === 'user'
                        ? 'bg-[#6059f7] text-white'
                        : 'bg-white border shadow-sm'
                    )}
                  >
                    <div className="text-sm whitespace-pre-line">
                      {message.text.split('\n').map((line, i) => {
                        // Handle bold text with **
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={i} className="mb-2">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                              )}
                            </p>
                          );
                        }
                        // Handle italic text with *
                        if (line.includes('*') && !line.startsWith('*')) {
                          const parts = line.split('*');
                          return (
                            <p key={i} className="mb-2">
                              {parts.map((part, j) =>
                                j % 2 === 1 ? <em key={j}>{part}</em> : part
                              )}
                            </p>
                          );
                        }
                        return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                      })}
                    </div>
                    <p
                      className={cn(
                        'text-xs mt-1',
                        message.sender === 'user'
                          ? 'text-white/70'
                          : 'text-gray-500'
                      )}
                    >
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {/* Action Required Badge */}
                {message.isAction && message.actionType && (
                  <div className="flex justify-start mt-2">
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded border border-yellow-300">
                      ⚡ {message.actionType}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg p-3 max-w-[80%]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#6059f7] hover:bg-[#4f47d9]"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all hover:scale-110 p-0 overflow-hidden',
          isOpen
            ? 'bg-gray-400 hover:bg-gray-500'
            : 'bg-white hover:bg-gray-50'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <img
            src="/icon_chatbot.png"
            alt="ChatBot"
            className="w-full h-full object-cover"
          />
        )}
      </Button>
    </>
  );
}
