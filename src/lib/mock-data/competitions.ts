// Mock data for Competitions

export interface Competition {
  id: string;
  title: string;
  description: string;
  banner: string;
  organizer: string;
  organizerId: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prize: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  teamSize: { min: number; max: number };
  participantCount: number;
  teamCount: number;
}

export interface CompetitionTeam {
  id: string;
  competitionId: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  lookingForMembers: boolean;
  skillsNeeded: string[];
  members: { userId: string; userName: string; userAvatar: string; role: string }[];
}

const mockCompetitions: Competition[] = [
  {
    id: '1',
    title: 'Thử thách Thuật toán 2025',
    description: 'Giải quyết các bài toán thuật toán phức tạp và cạnh tranh với những lập trình viên xuất sắc nhất. Thử thách kỹ năng của bạn về cấu trúc dữ liệu, quy hoạch động và thuật toán đồ thị.',
    banner: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    organizer: 'Đại học Công nghệ',
    organizerId: '1',
    subject: 'Khoa học máy tính',
    difficulty: 'advanced',
    prize: '100 triệu VNĐ + Cơ hội thực tập',
    startDate: '2025-11-01T00:00:00',
    endDate: '2025-11-30T23:59:59',
    registrationDeadline: '2025-10-28T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 3 },
    participantCount: 156,
    teamCount: 52,
  },
  {
    id: '2',
    title: 'Olympic Toán học Trực tuyến',
    description: 'Cuộc thi toán học quốc tế bao gồm đại số, hình học, lý thuyết số và tổ hợp.',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    organizer: 'Hội Toán học',
    organizerId: '2',
    subject: 'Toán học',
    difficulty: 'intermediate',
    prize: '60 triệu VNĐ + Chứng chỉ',
    startDate: '2025-10-29T00:00:00',
    endDate: '2025-10-29T23:59:59',
    registrationDeadline: '2025-10-27T23:59:59',
    status: 'ongoing',
    teamSize: { min: 1, max: 1 },
    participantCount: 234,
    teamCount: 234,
  },
  {
    id: '3',
    title: 'Hackathon Phát triển Web',
    description: 'Xây dựng ứng dụng web sáng tạo trong 48 giờ. Thể hiện kỹ năng phát triển full-stack của bạn.',
    banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    organizer: 'Cộng đồng Dev Việt Nam',
    organizerId: '3',
    subject: 'Khoa học máy tính',
    difficulty: 'intermediate',
    prize: '50 triệu VNĐ + Mentorship',
    startDate: '2025-11-15T09:00:00',
    endDate: '2025-11-17T18:00:00',
    registrationDeadline: '2025-11-10T23:59:59',
    status: 'upcoming',
    teamSize: { min: 2, max: 4 },
    participantCount: 89,
    teamCount: 23,
  },
  {
    id: '4',
    title: 'Thử thách Bài toán Vật lý',
    description: 'Giải các bài toán vật lý nâng cao về cơ học, điện từ học và vật lý lượng tử.',
    banner: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    organizer: 'Khoa Vật lý',
    organizerId: '4',
    subject: 'Vật lý',
    difficulty: 'advanced',
    prize: '30 triệu VNĐ + Cơ hội nghiên cứu',
    startDate: '2025-12-01T00:00:00',
    endDate: '2025-12-15T23:59:59',
    registrationDeadline: '2025-11-25T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 2 },
    participantCount: 67,
    teamCount: 45,
  },
  {
    id: '5',
    title: 'Cuộc thi Data Science',
    description: 'Phân tích dữ liệu, xây dựng mô hình dự đoán và trình bày insights. Thử thách khoa học dữ liệu thực tế.',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    organizer: 'CLB Khoa học Dữ liệu',
    organizerId: '5',
    subject: 'Khoa học máy tính',
    difficulty: 'intermediate',
    prize: '80 triệu VNĐ + Kết nối doanh nghiệp',
    startDate: '2025-09-15T00:00:00',
    endDate: '2025-10-15T23:59:59',
    registrationDeadline: '2025-09-10T23:59:59',
    status: 'completed',
    teamSize: { min: 1, max: 5 },
    participantCount: 312,
    teamCount: 78,
  },
  {
    id: '6',
    title: 'Cuộc thi Thuyết trình Tiếng Anh',
    description: 'Thể hiện khả năng thuyết trình và giao tiếp tiếng Anh của bạn trước ban giám khảo quốc tế.',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    organizer: 'Trung tâm Anh ngữ Quốc tế',
    organizerId: '6',
    subject: 'Ngoại ngữ',
    difficulty: 'intermediate',
    prize: '40 triệu VNĐ + Du học bổng',
    startDate: '2025-11-20T08:00:00',
    endDate: '2025-11-20T18:00:00',
    registrationDeadline: '2025-11-15T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 1 },
    participantCount: 78,
    teamCount: 78,
  },
  {
    id: '7',
    title: 'Cuộc thi Khởi nghiệp Sinh viên',
    description: 'Trình bày ý tưởng khởi nghiệp của bạn và tranh tài cùng các đội khác để giành quỹ đầu tư.',
    banner: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    organizer: 'Quỹ Khởi nghiệp Việt',
    organizerId: '7',
    subject: 'Kinh doanh',
    difficulty: 'beginner',
    prize: '200 triệu VNĐ + Quỹ đầu tư',
    startDate: '2025-12-10T09:00:00',
    endDate: '2025-12-12T17:00:00',
    registrationDeadline: '2025-12-05T23:59:59',
    status: 'upcoming',
    teamSize: { min: 3, max: 5 },
    participantCount: 145,
    teamCount: 34,
  },
  {
    id: '8',
    title: 'Cuộc thi Thiết kế UI/UX',
    description: 'Thiết kế giao diện người dùng và trải nghiệm người dùng cho một ứng dụng di động mới.',
    banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    organizer: 'Design Hub Vietnam',
    organizerId: '8',
    subject: 'Thiết kế',
    difficulty: 'intermediate',
    prize: '35 triệu VNĐ + Laptop',
    startDate: '2025-11-25T00:00:00',
    endDate: '2025-11-28T23:59:59',
    registrationDeadline: '2025-11-20T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 2 },
    participantCount: 92,
    teamCount: 56,
  },
  {
    id: '9',
    title: 'Cuộc thi Marketing Digital',
    description: 'Xây dựng chiến dịch marketing số cho một thương hiệu thực tế. Thể hiện sáng tạo và hiệu quả.',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    organizer: 'Marketing Association',
    organizerId: '9',
    subject: 'Marketing',
    difficulty: 'beginner',
    prize: '25 triệu VNĐ + Internship',
    startDate: '2025-10-28T00:00:00',
    endDate: '2025-11-05T23:59:59',
    registrationDeadline: '2025-10-26T23:59:59',
    status: 'ongoing',
    teamSize: { min: 2, max: 4 },
    participantCount: 167,
    teamCount: 45,
  },
  {
    id: '10',
    title: 'Cuộc thi Hóa học Sáng tạo',
    description: 'Thực hiện các thí nghiệm hóa học sáng tạo và trình bày kết quả nghiên cứu.',
    banner: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    organizer: 'Viện Hóa học',
    organizerId: '10',
    subject: 'Hóa học',
    difficulty: 'advanced',
    prize: '45 triệu VNĐ + Thiết bị lab',
    startDate: '2025-12-05T00:00:00',
    endDate: '2025-12-20T23:59:59',
    registrationDeadline: '2025-11-30T23:59:59',
    status: 'upcoming',
    teamSize: { min: 2, max: 3 },
    participantCount: 54,
    teamCount: 23,
  },
];

const mockTeams: CompetitionTeam[] = [
  {
    id: '1',
    competitionId: '1',
    name: 'Code Warriors',
    description: 'Experienced competitive programmers looking for one more member with strong DP skills.',
    memberCount: 2,
    maxMembers: 3,
    lookingForMembers: true,
    skillsNeeded: ['Dynamic Programming', 'Graph Algorithms'],
    members: [
      {
        userId: '1',
        userName: 'Alex Chen',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        role: 'Team Lead',
      },
      {
        userId: '2',
        userName: 'Sarah Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'Member',
      },
    ],
  },
  {
    id: '2',
    competitionId: '3',
    name: 'Full Stack Ninjas',
    description: 'Building a social platform for students. Need a backend developer.',
    memberCount: 3,
    maxMembers: 4,
    lookingForMembers: true,
    skillsNeeded: ['Node.js', 'Database Design', 'API Development'],
    members: [
      {
        userId: '3',
        userName: 'Michael Brown',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        role: 'Team Lead',
      },
      {
        userId: '4',
        userName: 'Emma Davis',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        role: 'Frontend Dev',
      },
      {
        userId: '5',
        userName: 'David Kim',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        role: 'UI/UX Designer',
      },
    ],
  },
];

export function getCompetitions(filters?: {
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  status?: 'upcoming' | 'ongoing' | 'completed';
  search?: string;
}): Competition[] {
  let filtered = [...mockCompetitions];

  if (filters?.subject) {
    filtered = filtered.filter(c => c.subject === filters.subject);
  }

  if (filters?.difficulty) {
    filtered = filtered.filter(c => c.difficulty === filters.difficulty);
  }

  if (filters?.status) {
    filtered = filtered.filter(c => c.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
  }

  return filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getCompetitionById(id: string): Competition | undefined {
  return mockCompetitions.find(c => c.id === id);
}

export function getCompetitionTeams(competitionId: string): CompetitionTeam[] {
  return mockTeams.filter(t => t.competitionId === competitionId);
}

export function getTeamById(id: string): CompetitionTeam | undefined {
  return mockTeams.find(t => t.id === id);
}

export function getCompetitionStats() {
  return {
    totalCompetitions: mockCompetitions.length,
    upcomingCompetitions: mockCompetitions.filter(c => c.status === 'upcoming').length,
    ongoingCompetitions: mockCompetitions.filter(c => c.status === 'ongoing').length,
    totalParticipants: mockCompetitions.reduce((sum, c) => sum + c.participantCount, 0),
  };
}

