'use client';

import { Badge as BadgeType } from '@/types/profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Award } from 'lucide-react';
import { format } from 'date-fns';

interface ProfileBadgesProps {
  badges: BadgeType[];
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  const earnedBadges = badges.filter((b) => !b.locked);
  const lockedBadges = badges.filter((b) => b.locked);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Huy hiệu ({earnedBadges.length}/{badges.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Đã đạt được</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-sm">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                  {badge.earnedAt && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {format(new Date(badge.earnedAt), 'MMM d, yyyy')}
                    </div>
                  )}
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {badge.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Chưa đạt được</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-4 rounded-lg border bg-muted/30 opacity-75"
                >
                  <div className="relative">
                    <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                    <Lock className="h-4 w-4 absolute -top-1 -right-1 text-muted-foreground" />
                  </div>
                  <div className="font-semibold text-sm">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                  {badge.requirement && (
                    <div className="text-xs text-muted-foreground mt-2">{badge.requirement}</div>
                  )}
                  {badge.progress !== undefined && (
                    <div className="w-full mt-3 space-y-1">
                      <Progress value={badge.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">{badge.progress}% hoàn thành</div>
                    </div>
                  )}
                  <Badge variant="outline" className="mt-2 text-xs">
                    {badge.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

