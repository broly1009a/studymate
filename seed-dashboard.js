const mockDashboardData = {
  welcomeMessage: 'Welcome back',
  studyStreak: {
    current: 7,
    longest: 15,
    lastStudyDate: new Date().toISOString(),
  },
  todaySchedule: [
    {
      id: '1',
      title: 'Mathematics Study Session',
      type: 'study-session',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      subject: 'Calculus',
      participants: ['Duy Anh'],
    },
    {
      id: '2',
      title: 'Physics Group Meeting',
      type: 'group-meeting',
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      subject: 'Quantum Mechanics',
      participants: ['Alice', 'Bob', 'Charlie'],
    },
  ],
  quickStats: {
    todayStudyTime: 45,
    weeklyStudyTime: 320,
    questionsAnswered: 12,
    upcomingDeadlines: 3,
  },
  recentActivities: [
    {
      id: '1',
      type: 'answer',
      title: 'Answered a question',
      description: 'You answered "How to solve quadratic equations?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      type: 'match',
      title: 'New study partner match',
      description: 'You matched with Sarah for Computer Science',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      type: 'group',
      title: 'Joined a study group',
      description: 'You joined "Advanced Mathematics Study Group"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  studyGoals: [
    {
      id: '1',
      title: 'Complete 50 study hours this month',
      description: 'Track your monthly study time',
      target: 50,
      current: 32,
      unit: 'hours',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
      progress: 64,
    },
    {
      id: '2',
      title: 'Answer 30 questions',
      description: 'Help others by answering questions',
      target: 30,
      current: 18,
      unit: 'questions',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(),
      progress: 60,
    },
  ],
  aiRecommendations: [
    {
      id: '1',
      type: 'study-partner',
      title: 'Connect with Alex Johnson',
      description:
        'Alex is also studying Computer Science and has similar learning preferences',
      reason: 'Based on your interests',
      actionUrl: '/matches/alex-johnson',
    },
    {
      id: '2',
      type: 'question',
      title: 'Popular question in your field',
      description: 'How to implement binary search trees?',
      reason: 'Trending in Computer Science',
      actionUrl: '/questions/123',
    },
    {
      id: '3',
      type: 'group',
      title: 'Join "Web Development Bootcamp"',
      description:
        'Active group with 45 members learning web development',
      reason: 'Matches your interests',
      actionUrl: '/groups/web-dev-bootcamp',
    },
  ],
  upcomingEvents: [
    {
      id: '1',
      title: 'Midterm Exam - Calculus',
      type: 'exam',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
      time: '09:00 AM',
      location: 'Room 301',
    },
    {
      id: '2',
      title: 'Coding Competition',
      type: 'competition',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      time: '02:00 PM',
      location: 'Online',
      participants: 150,
    },
    {
      id: '3',
      title: 'Project Submission Deadline',
      type: 'exam',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      time: '11:59 PM',
      location: 'Online',
    },
  ],
};

const mockTinderEvents = [
  {
    id: '1',
    title: 'Cuộc thi Lập trình ACM ICPC 2025',
    description: 'Cuộc thi lập trình quốc tế dành cho sinh viên',
    type: 'competition',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    time: '09:00 - 17:00',
    location: 'HCMUT',
    participants: 245,
    maxParticipants: 300,
    image: '/cuocthi.jpg',
    organizer: 'ACM ICPC Vietnam',
    tags: ['Lập trình', 'Thuật toán', 'Quốc tế'],
  },
  {
    id: '2',
    title: 'Hackathon AI & Machine Learning',
    description: 'Xây dựng giải pháp AI cho bài toán thực tế',
    type: 'competition',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    time: '08:00 - 20:00',
    location: 'Online',
    participants: 180,
    maxParticipants: 200,
    image: '/cuocthi.jpg',
    organizer: 'Google Developer Vietnam',
    tags: ['AI', 'Machine Learning', 'Hackathon'],
  },
  {
    id: '3',
    title: 'Cuộc thi Thiết kế UI/UX 2025',
    description: 'Thi thiết kế giao diện người dùng sáng tạo',
    type: 'competition',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    time: '10:00 - 18:00',
    location: 'UIT',
    participants: 120,
    maxParticipants: 150,
    image: '/cuocthi.jpg',
    organizer: 'Design Club UIT',
    tags: ['UI/UX', 'Design', 'Creative'],
  },
];

async function seedDashboardData() {
  try {
    const response = await fetch('http://localhost:3000/api/seed-dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clearExisting: true,
        ...mockDashboardData,
        mockTinderEvents,
      }),
    });

    const result = await response.json();
    console.log('Seed result:', result);
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedDashboardData();