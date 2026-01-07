import { z } from 'zod';
import {
  LEARNING_NEEDS,
  LEARNING_GOALS,
  STUDY_HABITS,
  MBTI_TYPES,
  GPA_RANGES,
  UNIVERSITIES,
} from './matching-constants';

// Gender validation
export const genderSchema = z.enum(['male', 'female', 'other']);

// MBTI validation
export const mbtiSchema = z.enum(MBTI_TYPES);

// GPA validation
export const gpaSchema = z.enum(GPA_RANGES);

// Education validation
export const educationSchema = z.object({
  level: z.enum(['high_school', 'undergraduate', 'graduate', 'other']).optional(),
  institution: z.string().min(1, 'Trường đại học là bắt buộc'),
  major: z.string().min(1, 'Chuyên ngành là bắt buộc'),
  graduationYear: z.number().min(2020).max(2040).optional(),
});

// Profile matching data validation
export const matchingProfileSchema = z.object({
  // Nhóm 1: Thông tin cá nhân (Bắt buộc)
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  gender: genderSchema,
  dateOfBirth: z.coerce.date(),

  // Nhóm 2: Thông tin học tập (Bắt buộc)
  education: educationSchema,

  // Nhóm 3: Nhu cầu & mục tiêu (Bắt buộc trừ MBTI)
  learningNeeds: z
    .array(z.string())
    .min(1, 'Vui lòng chọn ít nhất 1 nhu cầu học tập')
    .refine(
      (values) => values.every((v) => LEARNING_NEEDS.includes(v as any)),
      'Nhu cầu học tập không hợp lệ'
    ),
  learningGoals: z
    .array(z.string())
    .min(1, 'Vui lòng chọn ít nhất 1 mục tiêu học tập')
    .refine(
      (values) => values.every((v) => LEARNING_GOALS.includes(v as any)),
      'Mục tiêu học tập không hợp lệ'
    ),
  studyHabits: z
    .array(z.string())
    .min(1, 'Vui lòng chọn ít nhất 1 thói quen học tập')
    .refine(
      (values) => values.every((v) => STUDY_HABITS.includes(v as any)),
      'Thói quen học tập không hợp lệ'
    ),
  mbtiType: mbtiSchema.optional(),

  // Nhóm 4: Kỹ năng, thành tựu (Không bắt buộc)
  gpa: gpaSchema.optional(),
  awards: z.array(z.string()).optional(),
  certificates: z.array(z.string()).optional(),
});

// Update profile validation (all fields optional except userId)
export const updateProfileSchema = z.object({
  // Basic info
  fullName: z.string().min(1).optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  coverPhoto: z.string().url().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional(),

  // Personal info
  gender: genderSchema.optional(),
  dateOfBirth: z.date().optional(),

  // Education
  education: z
    .object({
      level: z.enum(['high_school', 'undergraduate', 'graduate', 'other']).optional(),
      institution: z.string().optional(),
      major: z.string().optional(),
      graduationYear: z.number().min(2020).max(2040).optional(),
    })
    .optional(),

  // Matching data
  learningNeeds: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
  studyHabits: z.array(z.string()).optional(),
  mbtiType: mbtiSchema.optional().nullable(),

  // Achievements
  gpa: gpaSchema.optional().nullable(),
  awards: z.array(z.string()).optional(),
  certificates: z.array(z.string()).optional(),

  // Skills (handled separately)
  skills: z
    .array(
      z.object({
        name: z.string(),
        category: z.string(),
        level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
        yearsOfExperience: z.number().min(0),
      })
    )
    .optional(),

  // Social links
  socialLinks: z
    .object({
      github: z.string().url().optional().or(z.literal('')),
      linkedin: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      website: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
});

// Matching criteria validation
export const matchingCriteriaSchema = z.object({
  university: z.string().optional(),
  major: z.string().optional(),
  learningNeeds: z.array(z.string()).optional(),
  learningGoals: z.array(z.string()).optional(),
  studyHabits: z.array(z.string()).optional(),
  mbtiType: mbtiSchema.optional(),
  gpaRange: gpaSchema.optional(),
  minAge: z.number().min(15).max(100).optional(),
  maxAge: z.number().min(15).max(100).optional(),
  gender: genderSchema.optional(),
});

export type MatchingProfileInput = z.infer<typeof matchingProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type MatchingCriteriaInput = z.infer<typeof matchingCriteriaSchema>;
