// Type definitions for study sessions and subjects

export type SessionStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export interface StudySession {
  id: string;
  userId?: string;
  subjectId: string;
  subjectName?: string;
  subject?: Subject;
  topic?: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  status?: SessionStatus;
  notes?: string;
  attachments?: Attachment[];
  type?: 'solo' | 'partner' | 'group';
  partnerId?: string;
  groupId?: string;
  pomodoroMode?: boolean;
  pomodoroCount?: number;
  pomodoroSettings?: PomodoroSettings;
  focusMode?: boolean;
  focusScore?: number;
  breaks?: number;
  tags?: string[];
  productivity?: number; // 1-5 rating
  createdAt?: string;
  updatedAt?: string;
}

export interface Subject {
  id: string;
  userId?: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  category?: string;
  goalHoursPerWeek?: number;
  goalHours?: number;
  priority?: 'low' | 'medium' | 'high';
  totalStudyTime?: number; // in minutes
  totalHours?: number;
  sessionCount?: number;
  sessionsCount?: number;
  averageSessionLength?: number; // in minutes
  lastStudied?: string;
  topics?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes, default 25
  breakDuration: number; // in minutes, default 5
  longBreakDuration: number; // in minutes, default 15
  cyclesBeforeLongBreak: number; // default 4
  currentCycle: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface SessionStatistics {
  totalSessions: number;
  totalHours: number;
  averageSessionLength: number;
  mostStudiedSubject: {
    id: string;
    name: string;
    hours: number;
  };
  studyStreak: number;
  longestStreak: number;
  thisWeek: {
    sessions: number;
    hours: number;
  };
  thisMonth: {
    sessions: number;
    hours: number;
  };
}

export interface SessionsByDate {
  date: string;
  sessions: StudySession[];
  totalDuration: number;
}

export interface SessionsBySubject {
  subjectId: string;
  subjectName: string;
  color: string;
  sessions: number;
  totalDuration: number;
  percentage: number;
}

export interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity level
}

export interface SessionChartData {
  date: string;
  sessions: number;
  hours: number;
  subjects: {
    [subjectName: string]: number;
  };
}

export interface HourlyPattern {
  hour: number;
  sessions: number;
  averageDuration: number;
  productivity: number;
}

export interface DailyPattern {
  day: string;
  sessions: number;
  hours: number;
  productivity: number;
}

// Active session state
export interface ActiveSessionState {
  sessionId: string;
  subjectId: string;
  subject: Subject;
  startTime: string;
  elapsedTime: number; // in seconds
  isPaused: boolean;
  pausedAt?: string;
  totalPausedTime: number; // in seconds
  pomodoroMode: boolean;
  pomodoroSettings?: PomodoroSettings;
  currentPhase?: 'work' | 'break' | 'long_break';
  phaseStartTime?: string;
  phaseElapsedTime?: number;
  notes: string;
  focusMode: boolean;
}

// Session filters
export interface SessionFilters {
  subjectIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  minDuration?: number;
  maxDuration?: number;
  type?: ('solo' | 'partner' | 'group')[];
  sortBy?: 'date' | 'duration' | 'subject';
  sortOrder?: 'asc' | 'desc';
}

// Subject statistics
export interface SubjectStatistics {
  totalStudyTime: number;
  sessionCount: number;
  averageSessionLength: number;
  goalProgress: number; // percentage
  weeklyProgress: {
    week: string;
    hours: number;
    goal: number;
  }[];
  recentSessions: StudySession[];
  relatedNotes: number;
  studyPartners: number;
}

// Create/Update payloads
export interface CreateSessionPayload {
  subjectId: string;
  startTime: string;
  type?: 'solo' | 'partner' | 'group';
  partnerId?: string;
  groupId?: string;
  pomodoroMode?: boolean;
  pomodoroSettings?: PomodoroSettings;
  focusMode?: boolean;
  notes?: string;
}

export interface EndSessionPayload {
  endTime: string;
  notes?: string;
  productivity?: number;
  attachments?: File[];
}

export interface CreateSubjectPayload {
  name: string;
  color: string;
  icon: string;
  description?: string;
  category: string;
  goalHoursPerWeek?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateSubjectPayload {
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  category?: string;
  goalHoursPerWeek?: number;
  priority?: 'low' | 'medium' | 'high';
}

// Timer state
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedTime: number;
  targetTime?: number;
  startTime?: string;
  pausedAt?: string;
  totalPausedTime: number;
}

// Session history view options
export interface SessionHistoryViewOptions {
  view: 'list' | 'calendar' | 'heatmap';
  period: 'week' | 'month' | 'year' | 'all';
  groupBy?: 'date' | 'subject' | 'type';
}

