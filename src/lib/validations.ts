import { z } from 'zod';

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  passwordConfirmation: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

// Onboarding Validations - New matching system
export const onboardingStep1Schema = z.object({
  fullName: z.string().min(1, 'Ô này phải chứa từ 1 đến 22 ký tự.').max(22, 'Ô này phải chứa từ 1 đến 22 ký tự.'),
  dateOfBirth: z.object({
    day: z.string().min(1, 'Ngày sinh không hợp lệ'),
    month: z.string().min(1, 'Tháng sinh không hợp lệ'),
    year: z.string().min(1, 'Năm sinh không hợp lệ'),
  }),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Vui lòng chọn giới tính',
  }),
});

export const onboardingStep2Schema = z.object({
  university: z.string().min(1, 'Vui lòng chọn trường đại học'),
  major: z.string().min(1, 'Vui lòng chọn chuyên ngành'),
  learningNeeds: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 nhu cầu học tập'),
});

export const onboardingStep3Schema = z.object({
  learningGoals: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 mục tiêu học tập'),
  studyHabits: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 thói quen học tập'),
  mbtiType: z.string().optional(),
});

export const onboardingStep4Schema = z.object({
  gpa: z.string().optional(),
  certificates: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;

