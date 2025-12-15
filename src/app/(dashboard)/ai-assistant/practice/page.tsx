'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AIPracticeGeneratorPage() {
  const [settings, setSettings] = useState({
    subject: '',
    difficulty: 'intermediate',
    questionType: 'multiple-choice',
    count: '5',
  });

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleGenerate = () => {
    if (!settings.subject) {
      toast.error('Please select a subject');
      return;
    }

    // Simulate AI generation
    const mockQuestions = [
      {
        id: 1,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 'O(log n)',
        explanation: 'Binary search divides the search space in half with each iteration, resulting in logarithmic time complexity.',
      },
      {
        id: 2,
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctAnswer: 'Stack',
        explanation: 'Stack follows Last-In-First-Out (LIFO) principle where the last element added is the first to be removed.',
      },
    ];

    setQuestions(mockQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    toast.success('Practice questions generated!');
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      toast.success('Practice session completed!');
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-yellow-500" />
          AI Practice Generator
        </h1>
        <p className="text-muted-foreground mt-2">Generate practice questions with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Customize your practice session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject *</label>
              <Select
                value={settings.subject}
                onValueChange={(value) => setSettings({ ...settings, subject: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="algorithms">Algorithms</SelectItem>
                  <SelectItem value="data-structures">Data Structures</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={settings.difficulty}
                onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Question Type</label>
              <Select
                value={settings.questionType}
                onValueChange={(value) => setSettings({ ...settings, questionType: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Number of Questions</label>
              <Select
                value={settings.count}
                onValueChange={(value) => setSettings({ ...settings, count: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Questions
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Questions Generated Yet</h3>
                <p className="text-muted-foreground">
                  Configure settings and click "Generate Questions" to start practicing
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
                  <Badge variant="secondary">{settings.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
                  <div className="space-y-2">
                    {currentQ.options.map((option: string) => (
                      <button
                        key={option}
                        onClick={() => !showResult && setSelectedAnswer(option)}
                        disabled={showResult}
                        className={`w-full p-4 text-left border rounded-lg transition-colors ${
                          selectedAnswer === option
                            ? showResult
                              ? option === currentQ.correctAnswer
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-red-500 bg-red-500/10'
                              : 'border-primary bg-primary/10'
                            : showResult && option === currentQ.correctAnswer
                            ? 'border-green-500 bg-green-500/10'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showResult && option === currentQ.correctAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {showResult && selectedAnswer === option && option !== currentQ.correctAnswer && (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {showResult && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-500 mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground">{currentQ.explanation}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {!showResult ? (
                    <Button onClick={handleSubmit} className="flex-1">
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="flex-1">
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

