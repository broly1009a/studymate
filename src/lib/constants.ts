export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'StudyMate';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

// Auth
export const AUTH_TOKEN_KEY = 'studymate_auth_token';
export const AUTH_USER_KEY = 'studymate_user';
export const AUTH_REFRESH_TOKEN_KEY = 'studymate_refresh_token';

// Routes
export const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
export const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/onboarding'];
export const PROTECTED_ROUTES = ['/dashboard', '/profile', '/matches', '/questions', '/groups', '/competitions'];

// Subjects
export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
  'Geography',
  'Economics',
  'Psychology',
  'Philosophy',
  'Art',
  'Music',
  'Physical Education',
  'Foreign Languages',
];

// Interests
export const INTERESTS = [
  'Programming',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Machine Learning',
  'Artificial Intelligence',
  'Cybersecurity',
  'Game Development',
  'UI/UX Design',
  'Digital Marketing',
  'Content Writing',
  'Photography',
  'Video Editing',
  'Music Production',
  'Graphic Design',
];

// Study Styles
export const STUDY_STYLES = [
  { value: 'visual', label: 'Visual', description: 'Learn best through images, diagrams, and videos' },
  { value: 'auditory', label: 'Auditory', description: 'Learn best through listening and discussion' },
  { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn best through hands-on activities' },
  { value: 'reading', label: 'Reading/Writing', description: 'Learn best through reading and writing' },
];

// Preferred Times
export const PREFERRED_TIMES = [
  { value: 'morning', label: 'Morning', description: '6:00 AM - 12:00 PM' },
  { value: 'afternoon', label: 'Afternoon', description: '12:00 PM - 6:00 PM' },
  { value: 'evening', label: 'Evening', description: '6:00 PM - 10:00 PM' },
  { value: 'night', label: 'Night', description: '10:00 PM - 2:00 AM' },
];

// Group Sizes
export const GROUP_SIZES = [
  { value: 'one-on-one', label: 'One-on-One', description: 'Individual study sessions' },
  { value: 'small-group', label: 'Small Group', description: '3-5 people' },
  { value: 'large-group', label: 'Large Group', description: '6+ people' },
];

// Session Durations (in minutes)
export const SESSION_DURATIONS = [15, 30, 45, 60, 90, 120, 180, 240];

// Notification Types
export const NOTIFICATION_TYPES = {
  MATCH: 'match',
  QUESTION: 'question',
  GROUP: 'group',
  COMPETITION: 'competition',
  SYSTEM: 'system',
} as const;

// Activity Types
export const ACTIVITY_TYPES = {
  QUESTION: 'question',
  ANSWER: 'answer',
  GROUP: 'group',
  MATCH: 'match',
  COMPETITION: 'competition',
} as const;

