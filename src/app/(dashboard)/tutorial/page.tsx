'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, X, BookOpen, Users, Trophy, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function TutorialPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const steps = [
    {
      title: 'Welcome to StudyMate!',
      description: 'Your all-in-one platform for collaborative learning and academic success.',
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      title: 'Dashboard Overview',
      description: 'Track your study sessions, goals, and progress all in one place. Stay organized and motivated!',
      icon: Target,
      color: 'text-green-500',
    },
    {
      title: 'Connect with Study Partners',
      description: 'Find study partners, join groups, and collaborate with peers who share your learning goals.',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Compete and Grow',
      description: 'Participate in competitions, earn achievements, and climb the leaderboards!',
      icon: Trophy,
      color: 'text-yellow-500',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorialCompleted', 'true');
    }
    router.push('/dashboard');
  };

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorialCompleted', 'true');
    }
    toast.success('Welcome to StudyMate!');
    router.push('/dashboard');
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-between items-start mb-6">
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Icon className={`h-10 w-10 ${currentStepData.color}`} />
            </div>
            <h1 className="text-3xl font-bold mb-3">{currentStepData.title}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-accent'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded"
              />
              Don't show again
            </label>

            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

