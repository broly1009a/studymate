'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAchievements, getAchievementStats } from '@/lib/mock-data/goals';
import { Award, Lock, Trophy, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const achievements = getAchievements(
    filter === 'all' ? {} : { isUnlocked: filter === 'unlocked' }
  );
  const stats = getAchievementStats();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/10 text-gray-500';
      case 'rare': return 'bg-blue-500/10 text-blue-500';
      case 'epic': return 'bg-purple-500/10 text-purple-500';
      case 'legendary': return 'bg-yellow-500/10 text-yellow-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study': return '📚';
      case 'social': return '👥';
      case 'streak': return '🔥';
      case 'milestone': return '🎯';
      case 'special': return '⭐';
      default: return '🏆';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-2">Unlock achievements by completing challenges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.unlocked}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.totalPoints}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.unlocked} / {stats.total} achievements
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unlocked' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unlocked')}
        >
          Unlocked
        </Button>
        <Button
          variant={filter === 'locked' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('locked')}
        >
          Locked
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`${
              achievement.isUnlocked
                ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'
                : 'opacity-75'
            } transition-all hover:scale-105`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`text-4xl ${!achievement.isUnlocked && 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {achievement.title}
                      {achievement.isUnlocked && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                        {achievement.rarity}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getCategoryIcon(achievement.category)} {achievement.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              
              {/* Requirement */}
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Requirement:</span> {achievement.requirement}
              </div>

              {/* Progress Bar for Locked Achievements */}
              {!achievement.isUnlocked && achievement.progress !== undefined && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Points & Unlock Date */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{achievement.points} pts</span>
                </div>
                {achievement.isUnlocked ? (
                  <div className="text-xs text-muted-foreground">
                    {achievement.unlockedAt && format(new Date(achievement.unlockedAt), 'MMM d, yyyy')}
                  </div>
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {achievements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Achievements Found</h3>
            <p className="text-muted-foreground">
              {filter === 'unlocked' 
                ? "You haven't unlocked any achievements yet. Keep studying!"
                : "No locked achievements to display"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Achievement Categories */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Achievement Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['study', 'social', 'streak', 'milestone', 'special'].map((category) => {
              const categoryAchievements = getAchievements({ category });
              const unlockedCount = categoryAchievements.filter(a => a.isUnlocked).length;
              
              return (
                <div key={category} className="text-center">
                  <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                  <div className="text-sm font-medium capitalize">{category}</div>
                  <div className="text-xs text-muted-foreground">
                    {unlockedCount}/{categoryAchievements.length}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

