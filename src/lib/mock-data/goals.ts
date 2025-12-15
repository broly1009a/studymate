// Mock data for goals and achievements

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'study_hours' | 'sessions' | 'subject_mastery' | 'streak' | 'custom';
  category: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'failed' | 'paused';
  priority: 'low' | 'medium' | 'high';
  subjectId?: string;
  subjectName?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'social' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: string;
  progress?: number;
  requirement: string;
  isUnlocked: boolean;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Study 20 Hours This Week',
    description: 'Complete 20 hours of focused study sessions this week',
    type: 'study_hours',
    category: 'weekly',
    targetValue: 20,
    currentValue: 14.5,
    unit: 'hours',
    startDate: '2025-10-21',
    endDate: '2025-10-27',
    status: 'active',
    priority: 'high',
    color: '#3b82f6',
    icon: '🎯',
    createdAt: '2025-10-21',
  },
  {
    id: '2',
    title: 'Complete 5 Math Sessions',
    description: 'Finish 5 study sessions for Mathematics',
    type: 'sessions',
    category: 'weekly',
    targetValue: 5,
    currentValue: 3,
    unit: 'sessions',
    startDate: '2025-10-21',
    endDate: '2025-10-27',
    status: 'active',
    priority: 'high',
    subjectId: 'math',
    subjectName: 'Mathematics',
    color: '#8b5cf6',
    icon: '📐',
    createdAt: '2025-10-21',
  },
  {
    id: '3',
    title: '30-Day Study Streak',
    description: 'Study at least 1 hour every day for 30 days',
    type: 'streak',
    category: 'monthly',
    targetValue: 30,
    currentValue: 12,
    unit: 'days',
    startDate: '2025-10-01',
    endDate: '2025-10-30',
    status: 'active',
    priority: 'medium',
    color: '#f59e0b',
    icon: '🔥',
    createdAt: '2025-10-01',
  },
  {
    id: '4',
    title: 'Master Physics Fundamentals',
    description: 'Complete all fundamental topics in Physics',
    type: 'subject_mastery',
    category: 'monthly',
    targetValue: 100,
    currentValue: 65,
    unit: '%',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'active',
    priority: 'medium',
    subjectId: 'physics',
    subjectName: 'Physics',
    color: '#10b981',
    icon: '⚛️',
    createdAt: '2025-10-01',
  },
  {
    id: '5',
    title: 'Study 100 Hours This Month',
    description: 'Achieve 100 total study hours in October',
    type: 'study_hours',
    category: 'monthly',
    targetValue: 100,
    currentValue: 100,
    unit: 'hours',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'completed',
    priority: 'high',
    color: '#22c55e',
    icon: '✅',
    createdAt: '2025-10-01',
    completedAt: '2025-10-27',
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: '🎓',
    category: 'milestone',
    rarity: 'common',
    points: 10,
    requirement: 'Complete 1 study session',
    isUnlocked: true,
    unlockedAt: '2025-10-15',
  },
  {
    id: '2',
    title: 'Dedicated Learner',
    description: 'Study for 10 hours total',
    icon: '📚',
    category: 'study',
    rarity: 'common',
    points: 25,
    requirement: 'Study for 10 hours',
    isUnlocked: true,
    unlockedAt: '2025-10-18',
  },
  {
    id: '3',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    points: 50,
    requirement: 'Study 7 days in a row',
    isUnlocked: true,
    unlockedAt: '2025-10-22',
  },
  {
    id: '4',
    title: 'Century Club',
    description: 'Study for 100 hours total',
    icon: '💯',
    category: 'study',
    rarity: 'epic',
    points: 100,
    requirement: 'Study for 100 hours',
    isUnlocked: true,
    unlockedAt: '2025-10-27',
  },
  {
    id: '5',
    title: 'Social Butterfly',
    description: 'Study with 5 different partners',
    icon: '🦋',
    category: 'social',
    rarity: 'rare',
    points: 50,
    requirement: 'Study with 5 partners',
    isUnlocked: false,
    progress: 60,
  },
  {
    id: '6',
    title: 'Marathon Master',
    description: 'Complete a 5-hour study session',
    icon: '🏃',
    category: 'study',
    rarity: 'epic',
    points: 75,
    requirement: 'Study for 5 hours in one session',
    isUnlocked: false,
    progress: 80,
  },
  {
    id: '7',
    title: 'Pomodoro Pro',
    description: 'Complete 100 pomodoro cycles',
    icon: '🍅',
    category: 'study',
    rarity: 'rare',
    points: 60,
    requirement: 'Complete 100 pomodoros',
    isUnlocked: false,
    progress: 45,
  },
  {
    id: '8',
    title: 'Night Owl',
    description: 'Study after midnight 10 times',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 40,
    requirement: 'Study after midnight 10 times',
    isUnlocked: false,
    progress: 30,
  },
  {
    id: '9',
    title: 'Early Bird',
    description: 'Study before 6 AM 10 times',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    points: 40,
    requirement: 'Study before 6 AM 10 times',
    isUnlocked: false,
    progress: 0,
  },
  {
    id: '10',
    title: 'Legend',
    description: 'Maintain a 365-day study streak',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    points: 500,
    requirement: 'Study 365 days in a row',
    isUnlocked: false,
    progress: 3,
  },
];

export function getGoals(filters?: { status?: string; category?: string }): Goal[] {
  let filtered = [...mockGoals];
  
  if (filters?.status) {
    filtered = filtered.filter(g => g.status === filters.status);
  }
  
  if (filters?.category) {
    filtered = filtered.filter(g => g.category === filters.category);
  }
  
  return filtered;
}

export function getGoalById(id: string): Goal | undefined {
  return mockGoals.find(g => g.id === id);
}

export function getAchievements(filters?: { isUnlocked?: boolean; category?: string }): Achievement[] {
  let filtered = [...mockAchievements];
  
  if (filters?.isUnlocked !== undefined) {
    filtered = filtered.filter(a => a.isUnlocked === filters.isUnlocked);
  }
  
  if (filters?.category) {
    filtered = filtered.filter(a => a.category === filters.category);
  }
  
  return filtered;
}

export function getGoalStats() {
  const activeGoals = mockGoals.filter(g => g.status === 'active');
  const completedGoals = mockGoals.filter(g => g.status === 'completed');
  const totalProgress = activeGoals.reduce((sum, g) => sum + (g.currentValue / g.targetValue) * 100, 0) / activeGoals.length;
  
  return {
    total: mockGoals.length,
    active: activeGoals.length,
    completed: completedGoals.length,
    averageProgress: totalProgress,
  };
}

export function getAchievementStats() {
  const unlocked = mockAchievements.filter(a => a.isUnlocked);
  const totalPoints = unlocked.reduce((sum, a) => sum + a.points, 0);
  
  return {
    total: mockAchievements.length,
    unlocked: unlocked.length,
    locked: mockAchievements.length - unlocked.length,
    totalPoints,
    completionRate: (unlocked.length / mockAchievements.length) * 100,
  };
}

