// Type definitions for user profile and related features

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  education: Education;
  skills: Skill[];
  languages: Language[];
  statistics: UserStatistics;
  badges: Badge[];
  reputation: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  level: 'high_school' | 'undergraduate' | 'graduate' | 'postgraduate' | 'other';
  institution: string;
  major?: string;
  graduationYear?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

export interface Language {
  code: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface UserStatistics {
  totalStudyHours: number;
  studyStreak: number;
  longestStreak: number;
  questionsAnswered: number;
  questionsAsked: number;
  groupsJoined: number;
  partnersConnected: number;
  competitionsParticipated: number;
  goalsCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'study' | 'community' | 'achievement' | 'special';
  earnedAt?: string;
  progress?: number;
  requirement?: string;
  locked: boolean;
}

export interface ReputationHistory {
  date: string;
  points: number;
  reason: string;
  type: 'earned' | 'lost';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  reputation: number;
  change: number;
}

// Settings types
export interface UserSettings {
  account: AccountSettings;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
}

export interface AccountSettings {
  email: string;
  username: string;
  phoneNumber?: string;
  timezone: string;
  language: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showActivity: boolean;
  showStatistics: boolean;
  allowMessages: 'everyone' | 'friends' | 'none';
  allowConnectionRequests: boolean;
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    messages: boolean;
    connectionRequests: boolean;
    groupInvites: boolean;
    questionAnswers: boolean;
    achievements: boolean;
    weeklyDigest: boolean;
  };
  push: {
    enabled: boolean;
    messages: boolean;
    connectionRequests: boolean;
    groupInvites: boolean;
    questionAnswers: boolean;
    achievements: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  activeSessions: Session[];
  loginHistory: LoginHistoryEntry[];
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  success: boolean;
}

// Preferences types
export interface UserPreferences {
  studyMethods: StudyMethodPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  timezone: string;
  defaultViews: DefaultViewPreferences;
}

export interface StudyMethodPreferences {
  learningStyle: ('visual' | 'auditory' | 'kinesthetic' | 'reading')[];
  preferredSessionLength: number; // in minutes
  breakFrequency: number; // in minutes
  pomodoroEnabled: boolean;
  focusMusicEnabled: boolean;
  reminderEnabled: boolean;
}

export interface NotificationPreferences {
  studyReminders: boolean;
  goalDeadlines: boolean;
  partnerSessions: boolean;
  groupEvents: boolean;
  competitionUpdates: boolean;
  achievementUnlocked: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

export interface PrivacyPreferences {
  showOnlineStatus: boolean;
  showStudyActivity: boolean;
  showGoalProgress: boolean;
  allowDataSharing: boolean;
  allowAnalytics: boolean;
}

export interface DefaultViewPreferences {
  dashboardLayout: 'compact' | 'comfortable' | 'spacious';
  calendarView: 'month' | 'week' | 'day' | 'agenda';
  sessionListView: 'list' | 'calendar' | 'grid';
  notesView: 'list' | 'grid' | 'compact';
}

// Activity types
export interface Activity {
  id: string;
  type: 'study_session' | 'question_answered' | 'question_asked' | 'group_joined' | 'partner_connected' | 'goal_completed' | 'badge_earned' | 'competition_joined';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Social links
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  portfolio?: string;
}

// Profile update payload
export interface ProfileUpdatePayload {
  fullName?: string;
  bio?: string;
  avatar?: string;
  coverPhoto?: string;
  education?: Partial<Education>;
  skills?: Skill[];
  languages?: Language[];
  socialLinks?: SocialLinks;
}

