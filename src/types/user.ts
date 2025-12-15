export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  subjects: string[];
  interests: string[];
  learningPreferences: LearningPreferences;
  availability: AvailabilitySchedule;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export interface LearningPreferences {
  studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionDuration: number; // in minutes
  groupSize: 'one-on-one' | 'small-group' | 'large-group';
}

export interface AvailabilitySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface UserStats {
  studyStreak: number;
  totalStudyHours: number;
  questionsAsked: number;
  questionsAnswered: number;
  groupsJoined: number;
  competitionsParticipated: number;
  reputation: number;
}

export interface OnboardingData {
  step: number;
  basicInfo?: {
    fullName: string;
    bio: string;
  };
  subjectsInterests?: {
    subjects: string[];
    interests: string[];
  };
  learningPreferences?: LearningPreferences;
  availability?: AvailabilitySchedule;
}

