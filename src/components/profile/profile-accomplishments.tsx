'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, GraduationCap, Trophy } from 'lucide-react';

interface ProfileAccomplishmentsProps {
  gpa?: string;
  certificates?: string[];
  awards?: string[];
}

export function ProfileAccomplishments({ gpa, certificates, awards }: ProfileAccomplishmentsProps) {
  const hasData = gpa || certificates?.length || awards?.length;

  if (!hasData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Thành tích
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gpa && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <h4 className="font-medium text-sm">GPA</h4>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
              {gpa}
            </Badge>
          </div>
        )}

        {certificates && certificates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-green-500" />
              <h4 className="font-medium text-sm">Chứng chỉ</h4>
            </div>
            <ul className="space-y-2">
              {certificates.map((cert, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {awards && awards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <h4 className="font-medium text-sm">Giải thưởng</h4>
            </div>
            <ul className="space-y-2">
              {awards.map((award, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
