import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Recommendation } from '@/types/dashboard';
import { vi } from '@/lib/i18n/vi';

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

const typeLabels = {
  'study-partner': 'Bạn học',
  'question': 'Câu hỏi',
  'group': 'Nhóm học',
  'competition': 'Cuộc thi',
  'resource': 'Tài nguyên',
};

export function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          {vi.dashboard.aiRecommendations}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có gợi ý nào
          </p>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium flex-1">{rec.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {typeLabels[rec.type]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {rec.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600 font-medium">
                    {rec.reason}
                  </span>
                  <Link href={rec.actionUrl}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Xem
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

