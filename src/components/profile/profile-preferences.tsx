'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, BookOpen, Clock, Brain } from 'lucide-react';

interface ProfilePreferencesProps {
  learningNeeds?: string[];
  learningGoals?: string[];
  studyHabits?: string[];
  mbtiType?: string;
}

export function ProfilePreferences({
  learningNeeds,
  learningGoals,
  studyHabits,
  mbtiType,
}: ProfilePreferencesProps) {
  const hasData = learningNeeds?.length || learningGoals?.length || studyHabits?.length || mbtiType;

  if (!hasData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Sở thích học tập
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {learningNeeds && learningNeeds.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-sm">Nhu cầu học tập</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {learningNeeds.map((need) => (
                <Badge key={need} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {need}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {learningGoals && learningGoals.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              <h4 className="font-medium text-sm">Mục tiêu học tập</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {learningGoals.map((goal) => (
                <Badge key={goal} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {studyHabits && studyHabits.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-green-500" />
              <h4 className="font-medium text-sm">Thói quen học tập</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {studyHabits.map((habit) => (
                <Badge key={habit} variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                  {habit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {mbtiType && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-orange-500" />
              <h4 className="font-medium text-sm">MBTI</h4>
            </div>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 font-semibold">
              {mbtiType}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
