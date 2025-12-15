import { StudySession, Subject, SessionStatus } from '@/types/session';

// Mock subjects
export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    color: '#3b82f6',
    icon: '📐',
    totalHours: 45.5,
    sessionsCount: 23,
    averageSessionLength: 118,
    lastStudied: '2025-10-26T14:30:00Z',
    topics: ['Calculus', 'Linear Algebra', 'Statistics'],
    goalHours: 60,
  },
  {
    id: '2',
    name: 'Physics',
    color: '#8b5cf6',
    icon: '⚛️',
    totalHours: 32.0,
    sessionsCount: 18,
    averageSessionLength: 106,
    lastStudied: '2025-10-25T10:00:00Z',
    topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism'],
    goalHours: 50,
  },
  {
    id: '3',
    name: 'Computer Science',
    color: '#10b981',
    icon: '💻',
    totalHours: 67.5,
    sessionsCount: 35,
    averageSessionLength: 115,
    lastStudied: '2025-10-27T09:00:00Z',
    topics: ['Algorithms', 'Data Structures', 'Web Development'],
    goalHours: 80,
  },
  {
    id: '4',
    name: 'Chemistry',
    color: '#f59e0b',
    icon: '🧪',
    totalHours: 28.0,
    sessionsCount: 15,
    averageSessionLength: 112,
    lastStudied: '2025-10-24T16:00:00Z',
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
    goalHours: 40,
  },
  {
    id: '5',
    name: 'English Literature',
    color: '#ec4899',
    icon: '📚',
    totalHours: 21.5,
    sessionsCount: 12,
    averageSessionLength: 107,
    lastStudied: '2025-10-23T13:00:00Z',
    topics: ['Shakespeare', 'Modern Literature', 'Poetry'],
    goalHours: 30,
  },
];

// Mock study sessions
export const mockSessions: StudySession[] = [
  {
    id: '1',
    subjectId: '3',
    subjectName: 'Computer Science',
    topic: 'React Hooks',
    startTime: '2025-10-27T09:00:00Z',
    endTime: '2025-10-27T11:30:00Z',
    duration: 150,
    status: 'completed' as SessionStatus,
    notes: 'Learned about useEffect and useCallback hooks. Need to practice more with custom hooks.',
    focusScore: 85,
    breaks: 2,
    pomodoroCount: 6,
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: '2',
    subjectId: '1',
    subjectName: 'Mathematics',
    topic: 'Calculus - Derivatives',
    startTime: '2025-10-26T14:30:00Z',
    endTime: '2025-10-26T16:30:00Z',
    duration: 120,
    status: 'completed' as SessionStatus,
    notes: 'Practiced derivative rules. Completed 15 problems from the textbook.',
    focusScore: 92,
    breaks: 1,
    pomodoroCount: 5,
    tags: ['Calculus', 'Math'],
  },
  {
    id: '3',
    subjectId: '2',
    subjectName: 'Physics',
    topic: 'Thermodynamics',
    startTime: '2025-10-25T10:00:00Z',
    endTime: '2025-10-25T12:00:00Z',
    duration: 120,
    status: 'completed' as SessionStatus,
    notes: 'Studied the laws of thermodynamics and entropy.',
    focusScore: 78,
    breaks: 2,
    pomodoroCount: 5,
    tags: ['Physics', 'Thermodynamics'],
  },
  {
    id: '4',
    subjectId: '4',
    subjectName: 'Chemistry',
    topic: 'Organic Chemistry - Reactions',
    startTime: '2025-10-24T16:00:00Z',
    endTime: '2025-10-24T17:45:00Z',
    duration: 105,
    status: 'completed' as SessionStatus,
    notes: 'Reviewed substitution and elimination reactions.',
    focusScore: 88,
    breaks: 1,
    pomodoroCount: 4,
    tags: ['Chemistry', 'Organic'],
  },
  {
    id: '5',
    subjectId: '5',
    subjectName: 'English Literature',
    topic: 'Shakespeare - Hamlet',
    startTime: '2025-10-23T13:00:00Z',
    endTime: '2025-10-23T15:00:00Z',
    duration: 120,
    status: 'completed' as SessionStatus,
    notes: 'Read Act 3 and analyzed key themes.',
    focusScore: 75,
    breaks: 2,
    pomodoroCount: 5,
    tags: ['Literature', 'Shakespeare'],
  },
  {
    id: '6',
    subjectId: '3',
    subjectName: 'Computer Science',
    topic: 'Data Structures - Trees',
    startTime: '2025-10-22T10:00:00Z',
    endTime: '2025-10-22T12:30:00Z',
    duration: 150,
    status: 'completed' as SessionStatus,
    notes: 'Implemented binary search tree and AVL tree.',
    focusScore: 95,
    breaks: 1,
    pomodoroCount: 6,
    tags: ['Algorithms', 'Data Structures'],
  },
  {
    id: '7',
    subjectId: '1',
    subjectName: 'Mathematics',
    topic: 'Linear Algebra - Matrices',
    startTime: '2025-10-21T15:00:00Z',
    endTime: '2025-10-21T17:00:00Z',
    duration: 120,
    status: 'completed' as SessionStatus,
    notes: 'Practiced matrix multiplication and determinants.',
    focusScore: 82,
    breaks: 2,
    pomodoroCount: 5,
    tags: ['Linear Algebra', 'Math'],
  },
];

// Active session (if any)
export const activeSession: StudySession | null = null;

// Helper functions
export function getSessions(filters?: {
  subjectId?: string;
  status?: SessionStatus;
  startDate?: string;
  endDate?: string;
}): StudySession[] {
  let filtered = [...mockSessions];

  if (filters?.subjectId) {
    filtered = filtered.filter((s) => s.subjectId === filters.subjectId);
  }

  if (filters?.status) {
    filtered = filtered.filter((s) => s.status === filters.status);
  }

  if (filters?.startDate) {
    filtered = filtered.filter((s) => new Date(s.startTime) >= new Date(filters.startDate!));
  }

  if (filters?.endDate) {
    filtered = filtered.filter((s) => new Date(s.startTime) <= new Date(filters.endDate!));
  }

  return filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
}

export function getSessionById(id: string): StudySession | undefined {
  return mockSessions.find((s) => s.id === id);
}

export function getSubjects(): Subject[] {
  return mockSubjects;
}

export function getSubjectById(id: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === id);
}

export function getActiveSession(): StudySession | null {
  return activeSession;
}

export function getSessionStats() {
  const totalSessions = mockSessions.length;
  const totalHours = mockSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
  const averageFocusScore = mockSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / totalSessions;
  const totalPomodoros = mockSessions.reduce((sum, s) => sum + (s.pomodoroCount || 0), 0);

  return {
    totalSessions,
    totalHours: Math.round(totalHours * 10) / 10,
    averageFocusScore: Math.round(averageFocusScore),
    totalPomodoros,
  };
}

export function getWeeklySessionData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => ({
    day,
    hours: Math.random() * 5 + 1,
    sessions: Math.floor(Math.random() * 4) + 1,
  }));
}

export function getSubjectDistribution() {
  return mockSubjects.map((subject) => ({
    name: subject.name,
    hours: subject.totalHours,
    color: subject.color,
  }));
}

