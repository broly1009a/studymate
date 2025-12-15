'use client';

import { Education } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Calendar } from 'lucide-react';

interface ProfileEducationProps {
  education: Education;
}

const levelLabels = {
  high_school: 'Trung học phổ thông',
  undergraduate: 'Đại học',
  graduate: 'Sau đại học',
  postgraduate: 'Thạc sĩ/Tiến sĩ',
  other: 'Khác',
};

export function ProfileEducation({ education }: ProfileEducationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Giáo dục
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">{education.institution}</div>
            <div className="text-sm text-muted-foreground">
              {levelLabels[education.level]}
            </div>
          </div>
        </div>

        {education.major && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Chuyên ngành</div>
              <div className="text-sm text-muted-foreground">{education.major}</div>
            </div>
          </div>
        )}

        {education.graduationYear && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Năm tốt nghiệp</div>
              <div className="text-sm text-muted-foreground">{education.graduationYear}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

