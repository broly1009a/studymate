/**
 * AI Chat Widget Component
 * 
 * Minimal, cost-optimized chat interface for StudyMate
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/hooks/use-ai-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

interface AIChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export function AIChatWidget({
  isOpen: initialIsOpen = false,
  onClose,
  position = 'bottom-right',
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, error, sendMessage, clearChat } = useAIChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClasses[position]} z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors`}
        aria-label="Open AI Chat"
        title="StudyMate AI Copilot"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold">StudyMate AI</h3>
          <p className="text-xs opacity-90">Hỗ trợ 24/7</p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-blue-600 rounded transition-colors"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm mt-8">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
            <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
            <p className="text-xs mt-2">Hỏi về khóa học, lịch học, hoặc cách sử dụng StudyMate.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
              <Loader size={16} className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg flex gap-2"
      >
        <Input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          disabled={isLoading}
          className="flex-1 text-sm"
          maxLength={200}
        />
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send size={16} />
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 px-3 py-1 border-t border-gray-200">
        Trợ lý AI StudyMate
      </div>
    </div>
  );
}
