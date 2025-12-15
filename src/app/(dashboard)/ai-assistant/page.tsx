'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, BookOpen, Calculator, Code } from 'lucide-react';

export default function AIAssistantPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI study assistant. I can help you with homework, explain concepts, generate practice problems, and more. How can I help you today?',
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    const aiResponse = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'I understand your question. Let me help you with that...',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setMessage('');
  };

  const quickActions = [
    { icon: BookOpen, label: 'Explain Concept', prompt: 'Explain the concept of...' },
    { icon: Calculator, label: 'Solve Problem', prompt: 'Help me solve this problem...' },
    { icon: Code, label: 'Code Review', prompt: 'Review my code...' },
    { icon: Sparkles, label: 'Generate Quiz', prompt: 'Generate a quiz on...' },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-8 w-8" />
          AI Study Assistant
        </h1>
        <p className="text-muted-foreground mt-2">Get instant help with your studies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto space-y-4 p-4 border rounded-lg">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setMessage(action.prompt)}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <div className="text-sm">
                  <div className="font-medium">Homework Help</div>
                  <div className="text-muted-foreground">Get step-by-step solutions</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <div className="text-sm">
                  <div className="font-medium">Concept Explanation</div>
                  <div className="text-muted-foreground">Understand difficult topics</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <div className="text-sm">
                  <div className="font-medium">Practice Problems</div>
                  <div className="text-muted-foreground">Generate custom exercises</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="mt-0.5">✓</Badge>
                <div className="text-sm">
                  <div className="font-medium">Code Review</div>
                  <div className="text-muted-foreground">Get feedback on your code</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Questions Asked</div>
                <div className="text-2xl font-bold">47</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
                <div className="text-2xl font-bold">32</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Concepts Explained</div>
                <div className="text-2xl font-bold">18</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

