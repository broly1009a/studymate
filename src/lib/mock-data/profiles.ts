// Mock data for user profiles
import { UserProfile, Badge, Activity, ReputationHistory, LeaderboardEntry } from '@/types/profile';

export const mockUserProfile: UserProfile = {
  id: '1',
  username: 'Duy Anh',
  email: 'DuyAnh@example.com',
  fullName: 'Duy Anh',
  avatar: '/avatar.png',
  coverPhoto: '/cover.png',
  bio: 'Tớ là người có 3 năm kinh nghiệm lập trình bên forntEnd, và có học qua sơ lược về kinh tế vĩ mô',
  education: {
    level: 'undergraduate',
    institution: 'MIT',
    major: 'Computer Science',
    graduationYear: 2025,
  },
  skills: [
    { id: '1', name: 'Toán học', category: 'Học thuật', level: 'advanced', yearsOfExperience: 5 },
    { id: '2', name: 'Vật lý', category: 'Học thuật', level: 'intermediate', yearsOfExperience: 3 },
    { id: '3', name: 'Lập trình', category: 'Kỹ thuật', level: 'expert', yearsOfExperience: 7 },
    { id: '4', name: 'Cấu trúc dữ liệu', category: 'Kỹ thuật', level: 'advanced', yearsOfExperience: 4 },
    { id: '5', name: 'Thuật toán', category: 'Kỹ thuật', level: 'advanced', yearsOfExperience: 4 },
  ],
  languages: [
    { code: 'en', name: 'English', proficiency: 'native' },
    { code: 'es', name: 'Spanish', proficiency: 'conversational' },
    { code: 'fr', name: 'French', proficiency: 'basic' },
  ],
  statistics: {
    totalStudyHours: 1250,
    studyStreak: 45,
    longestStreak: 120,
    questionsAnswered: 342,
    questionsAsked: 89,
    groupsJoined: 12,
    partnersConnected: 28,
    competitionsParticipated: 5,
    goalsCompleted: 67,
  },
  badges: [
    {
      id: '1',
      name: 'Chuỗi 100 ngày',
      description: 'Học trong 100 ngày liên tiếp',
      icon: '🔥',
      category: 'study',
      earnedAt: '2024-09-15T10:00:00Z',
      locked: false,
    },
    {
      id: '2',
      name: 'Bậc thầy câu hỏi',
      description: 'Đã trả lời 100 câu hỏi',
      icon: '💡',
      category: 'community',
      earnedAt: '2024-08-20T14:30:00Z',
      locked: false,
    },
    {
      id: '3',
      name: 'Chim sớm',
      description: 'Học trước 6 giờ sáng trong 30 ngày',
      icon: '🌅',
      category: 'achievement',
      earnedAt: '2024-07-10T05:45:00Z',
      locked: false,
    },
    {
      id: '4',
      name: 'Cú đêm',
      description: 'Học sau 10 giờ tối trong 30 ngày',
      icon: '🦉',
      category: 'achievement',
      locked: true,
      progress: 65,
      requirement: '30 buổi học đêm khuya',
    },
    {
      id: '5',
      name: 'Người đồng đội',
      description: 'Tham gia 10 nhóm học',
      icon: '🤝',
      category: 'community',
      earnedAt: '2024-06-05T16:20:00Z',
      locked: false,
    },
    {
      id: '6',
      name: 'Vận động viên marathon',
      description: 'Học tổng cộng 1000 giờ',
      icon: '🏃',
      category: 'study',
      locked: true,
      progress: 85,
      requirement: 'Tổng cộng 1000 giờ học',
    },
  ],
  reputation: 2450,
  createdAt: '2023-01-15T08:00:00Z',
  updatedAt: '2024-10-27T12:00:00Z',
};

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'study_session',
    title: 'Hoàn thành buổi học',
    description: 'Đã học Giải tích trong 2 giờ',
    timestamp: '2024-10-27T10:00:00Z',
    metadata: { subject: 'Calculus', duration: 120 },
  },
  {
    id: '2',
    type: 'question_answered',
    title: 'Đã trả lời câu hỏi',
    description: 'Đã giúp đỡ với bài toán Đại số tuyến tính',
    timestamp: '2024-10-26T15:30:00Z',
    metadata: { questionId: 'q123', subject: 'Linear Algebra' },
  },
  {
    id: '3',
    type: 'badge_earned',
    title: 'Đạt được huy hiệu',
    description: 'Mở khóa huy hiệu "Chuỗi 100 ngày"',
    timestamp: '2024-10-25T09:00:00Z',
    metadata: { badgeId: '1', badgeName: '100 Day Streak' },
  },
  {
    id: '4',
    type: 'goal_completed',
    title: 'Hoàn thành mục tiêu',
    description: 'Hoàn thành mục tiêu học tập hàng tuần',
    timestamp: '2024-10-24T20:00:00Z',
    metadata: { goalId: 'g456', goalName: 'Study 20 hours this week' },
  },
  {
    id: '5',
    type: 'partner_connected',
    title: 'Kết nối với bạn học',
    description: 'Bắt đầu học với Sarah Johnson',
    timestamp: '2024-10-23T14:00:00Z',
    metadata: { partnerId: 'u789', partnerName: 'Sarah Johnson' },
  },
  {
    id: '6',
    type: 'group_joined',
    title: 'Tham gia nhóm học',
    description: 'Đã tham gia nhóm "Toán học nâng cao"',
    timestamp: '2024-10-22T11:00:00Z',
    metadata: { groupId: 'g123', groupName: 'Advanced Mathematics' },
  },
];

export const mockReputationHistory: ReputationHistory[] = [
  { date: '2024-10-27', points: 50, reason: 'Answered 5 questions', type: 'earned' },
  { date: '2024-10-26', points: 30, reason: 'Completed study session', type: 'earned' },
  { date: '2024-10-25', points: 100, reason: 'Earned badge', type: 'earned' },
  { date: '2024-10-24', points: 20, reason: 'Helped study partner', type: 'earned' },
  { date: '2024-10-23', points: 40, reason: 'Asked quality question', type: 'earned' },
  { date: '2024-10-22', points: 25, reason: 'Joined study group', type: 'earned' },
  { date: '2024-10-21', points: 60, reason: 'Completed goal', type: 'earned' },
  { date: '2024-10-20', points: 35, reason: 'Study streak milestone', type: 'earned' },
  { date: '2024-10-19', points: 45, reason: 'Answered difficult question', type: 'earned' },
  { date: '2024-10-18', points: 30, reason: 'Completed study session', type: 'earned' },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u001',
    username: 'alice_wonder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    reputation: 5280,
    change: 2,
  },
  {
    rank: 2,
    userId: 'u002',
    username: 'bob_builder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    reputation: 4950,
    change: -1,
  },
  {
    rank: 3,
    userId: 'u003',
    username: 'charlie_brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    reputation: 4720,
    change: 1,
  },
  {
    rank: 4,
    userId: '1',
    username: 'johndoe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    reputation: 2450,
    change: 0,
  },
  {
    rank: 5,
    userId: 'u005',
    username: 'emma_watson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    reputation: 2180,
    change: -2,
  },
];

// Function to get user profile by ID
export function getUserProfile(userId: string): UserProfile {
  // In a real app, this would fetch from an API
  if (userId === '1' || userId === 'me') {
    return mockUserProfile;
  }

  // Return a different mock profile for other users
  return {
    ...mockUserProfile,
    id: userId,
    username: `user_${userId}`,
    fullName: `User ${userId}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${userId}`,
  };
}

// Function to get user activities
export function getUserActivities(userId: string): Activity[] {
  return mockActivities;
}

// Function to get reputation history
export function getReputationHistory(userId: string): ReputationHistory[] {
  return mockReputationHistory;
}

// Function to get leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  return mockLeaderboard;
}

export const profiles = [mockUserProfile];

