// Type definitions for goals, achievements, and progress tracking

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetMetric: 'study_hours' | 'session_count' | 'questions_answered' | 'custom';
  targetValue: number;
  currentValue: number;
  subjectId?: string;
  subject?: {
    id: string;
    name: string;
    color: string;
  };
  startDate: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  progress: number; // percentage 0-100
  reminderEnabled: boolean;
  reminderTime?: string;
  milestones?: Milestone[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completed: boolean;
  completedAt?: string;
}

export interface GoalStatistics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  failedGoals: number;
  completionRate: number; // percentage
  averageProgress: number; // percentage
  thisWeek: {
    completed: number;
    created: number;
  };
  thisMonth: {
    completed: number;
    created: number;
  };
}

export interface GoalProgress {
  goalId: string;
  goal: Goal;
  progressHistory: ProgressEntry[];
  projectedCompletion?: string;
  onTrack: boolean;
  daysRemaining: number;
  averageDailyProgress: number;
}

export interface ProgressEntry {
  date: string;
  value: number;
  percentage: number;
  note?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'study_streak' | 'questions' | 'goals' | 'community' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  requirement: string;
  progress?: number; // percentage for locked achievements
  currentValue?: number;
  targetValue?: number;
  earned: boolean;
  earnedAt?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementCategory {
  name: string;
  description: string;
  achievements: Achievement[];
  totalEarned: number;
  totalAvailable: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakHistory: StreakEntry[];
  streakCalendar: StreakCalendarDay[];
}

export interface StreakEntry {
  startDate: string;
  endDate?: string;
  length: number;
  active: boolean;
}

export interface StreakCalendarDay {
  date: string;
  hasActivity: boolean;
  activityCount: number;
  level: 0 | 1 | 2 | 3 | 4;
}

// Goal filters
export interface GoalFilters {
  status?: ('active' | 'completed' | 'failed' | 'paused')[];
  type?: ('daily' | 'weekly' | 'monthly' | 'custom')[];
  subjectId?: string;
  sortBy?: 'deadline' | 'progress' | 'created' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Create/Update payloads
export interface CreateGoalPayload {
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetMetric: 'study_hours' | 'session_count' | 'questions_answered' | 'custom';
  targetValue: number;
  subjectId?: string;
  startDate?: string;
  deadline: string;
  reminderEnabled?: boolean;
  reminderTime?: string;
  milestones?: Omit<Milestone, 'id' | 'completed' | 'completedAt'>[];
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  targetValue?: number;
  deadline?: string;
  status?: 'active' | 'completed' | 'failed' | 'paused';
  reminderEnabled?: boolean;
  reminderTime?: string;
  milestones?: Milestone[];
}

// Progress tracking
export interface GoalProgressUpdate {
  goalId: string;
  value: number;
  note?: string;
  timestamp?: string;
}

// Charts and visualizations
export interface GoalChartData {
  date: string;
  target: number;
  actual: number;
  projected?: number;
}

export interface GoalComparisonData {
  goalId: string;
  goalTitle: string;
  progress: number;
  status: string;
  daysRemaining: number;
}

// Motivational messages
export interface MotivationalMessage {
  type: 'encouragement' | 'milestone' | 'warning' | 'celebration';
  title: string;
  message: string;
  icon: string;
}

// Leaderboard
export interface GoalLeaderboard {
  period: 'week' | 'month' | 'year' | 'all';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  goalsCompleted: number;
  totalPoints: number;
  change: number; // rank change from previous period
}

// Goal templates
export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  targetMetric: 'study_hours' | 'session_count' | 'questions_answered' | 'custom';
  suggestedTargetValue: number;
  category: string;
  popular: boolean;
}

// Activity log for goals
export interface GoalActivityLog {
  id: string;
  goalId: string;
  type: 'created' | 'updated' | 'progress' | 'milestone_reached' | 'completed' | 'failed' | 'paused' | 'resumed';
  description: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Goal insights
export interface GoalInsights {
  totalGoals: number;
  completionRate: number;
  averageTimeToComplete: number; // in days
  mostCommonType: string;
  mostCommonMetric: string;
  bestPerformingSubject?: {
    id: string;
    name: string;
    completionRate: number;
  };
  recommendations: string[];
}

