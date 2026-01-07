/**
 * Types for Matching System
 */

export type Gender = 'male' | 'female' | 'other';

export type EducationLevel = 'high_school' | 'undergraduate' | 'graduate' | 'other';

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type GPARange = '<2.5' | '2.5-3.0' | '3.0-3.5' | '3.5-4.0';

export interface MatchingProfile {
  // Nhóm 1: Thông tin cá nhân (Bắt buộc)
  fullName: string;
  gender: Gender;
  dateOfBirth: Date;

  // Nhóm 2: Thông tin học tập (Bắt buộc)
  university: string;
  major: string;

  // Nhóm 3: Nhu cầu & mục tiêu (Bắt buộc trừ MBTI)
  learningNeeds: string[];
  learningGoals: string[];
  studyHabits: string[];
  mbtiType?: MBTIType;

  // Nhóm 4: Kỹ năng, thành tựu (Không bắt buộc)
  gpa?: GPARange;
  awards?: string[];
  certificates?: string[];
  skills?: string[];
}

export interface MatchingCriteria {
  university?: string;
  major?: string;
  learningNeeds?: string[];
  learningGoals?: string[];
  studyHabits?: string[];
  mbtiType?: MBTIType;
  gpaRange?: GPARange;
  minAge?: number;
  maxAge?: number;
  gender?: Gender;
}

export interface MatchScore {
  userId: string;
  totalScore: number;
  breakdown: {
    university: number;
    major: number;
    learningNeeds: number;
    learningGoals: number;
    studyHabits: number;
    mbti: number;
    gpa: number;
    age: number;
  };
}
