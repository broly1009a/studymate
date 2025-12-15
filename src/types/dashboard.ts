export interface DashboardData {
  welcomeMessage: string;
  studyStreak: StudyStreak;
  todaySchedule: ScheduleItem[];
  quickStats: QuickStats;
  recentActivities: Activity[];
  studyGoals: StudyGoal[];
  aiRecommendations: Recommendation[];
  upcomingEvents: Event[];
}

export interface StudyStreak {
  current: number;
  longest: number;
  lastStudyDate: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  type: 'study-session' | 'group-meeting' | 'competition' | 'exam';
  startTime: string;
  endTime: string;
  subject?: string;
  participants?: string[];
}

export interface QuickStats {
  todayStudyTime: number; // in minutes
  weeklyStudyTime: number; // in minutes
  questionsAnswered: number;
  upcomingDeadlines: number;
}

export interface Activity {
  id: string;
  type: 'question' | 'answer' | 'group' | 'match' | 'competition';
  title: string;
  description: string;
  timestamp: string;
  icon?: string;
}

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  progress: number; // percentage
}

export interface Recommendation {
  id: string;
  type: 'study-partner' | 'question' | 'group' | 'competition' | 'resource';
  title: string;
  description: string;
  reason: string;
  actionUrl: string;
}

export interface Event {
  id: string;
  title: string;
  type: 'study-session' | 'group-meeting' | 'competition' | 'exam' | 'deadline';
  date: string;
  time: string;
  location?: string;
  participants?: number;
}

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  partnerId?: string;
  partnerName?: string;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  type: 'match' | 'question' | 'group' | 'competition' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  icon?: string;
}

