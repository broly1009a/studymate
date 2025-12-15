'use client';

import { Skill } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProfileSkillsProps {
  skills: Skill[];
}

const levelColors = {
  beginner: 'bg-blue-500',
  intermediate: 'bg-green-500',
  advanced: 'bg-orange-500',
  expert: 'bg-purple-500',
};

const levelProgress = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

const levelLabels = {
  beginner: 'Mới bắt đầu',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
  expert: 'Chuyên gia',
};

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kỹ năng & Chuyên môn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h3>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {levelLabels[skill.level]}
                      </Badge>
                    </div>
                    {skill.yearsOfExperience && (
                      <span className="text-sm text-muted-foreground">
                        {skill.yearsOfExperience} năm
                      </span>
                    )}
                  </div>
                  <Progress 
                    value={levelProgress[skill.level]} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

