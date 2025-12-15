// Mock data for Competitions

export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  organizerId: string;
  organizerName: string;
  category: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prizes: string;
  registrationStartDate: string;
  registrationEndDate: string;
  startDate: string;
  endDate: string;
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
    slug: 'thu-thach-thuat-toan-2025',
    description: 'Giải quyết các bài toán thuật toán phức tạp và cạnh tranh với những lập trình viên xuất sắc nhất. Thử thách kỹ năng của bạn về cấu trúc dữ liệu, quy hoạch động và thuật toán đồ thị.',
    banner: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    organizerId: '1',
    organizerName: 'Đại học Công nghệ',
    category: 'Lập trình',
    subject: 'Khoa học máy tính',
    difficulty: 'advanced',
    prizes: '100 triệu VNĐ + Cơ hội thực tập',
    registrationStartDate: '2025-10-01T00:00:00',
    registrationEndDate: '2025-10-28T23:59:59',
    startDate: '2025-11-01T00:00:00',
    endDate: '2025-11-30T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 3 },
    participantCount: 156,
    teamCount: 52,
  },
  {
    id: '2',
    title: 'Olympic Toán học Trực tuyến',
    slug: 'olympic-toan-hoc-truc-tuyen',
    description: 'Cuộc thi toán học quốc tế bao gồm đại số, hình học, lý thuyết số và tổ hợp.',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    organizerId: '2',
    organizerName: 'Hội Toán học',
    category: 'Toán học',
    subject: 'Toán học',
    difficulty: 'intermediate',
    prizes: '60 triệu VNĐ + Chứng chỉ',
    registrationStartDate: '2025-10-20T00:00:00',
    registrationEndDate: '2025-10-27T23:59:59',
    startDate: '2025-10-29T00:00:00',
    endDate: '2025-10-29T23:59:59',
    status: 'ongoing',
    teamSize: { min: 1, max: 1 },
    participantCount: 234,
    teamCount: 234,
  },
  {
    id: '3',
    title: 'Hackathon Phát triển Web',
    slug: 'hackathon-phat-trien-web',
    description: 'Xây dựng ứng dụng web sáng tạo trong 48 giờ. Thể hiện kỹ năng phát triển full-stack của bạn.',
    banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    organizerId: '3',
    organizerName: 'Cộng đồng Dev Việt Nam',
    category: 'Lập trình',
    subject: 'Khoa học máy tính',
    difficulty: 'intermediate',
    prizes: '50 triệu VNĐ + Mentorship',
    registrationStartDate: '2025-11-01T00:00:00',
    registrationEndDate: '2025-11-10T23:59:59',
    startDate: '2025-11-15T09:00:00',
    endDate: '2025-11-17T18:00:00',
    status: 'upcoming',
    teamSize: { min: 2, max: 4 },
    participantCount: 89,
    teamCount: 23,
  },
  {
    id: '4',
    title: 'Thử thách Bài toán Vật lý',
    slug: 'thu-thach-bai-toan-vat-ly',
    description: 'Giải các bài toán vật lý nâng cao về cơ học, điện từ học và vật lý lượng tử.',
    banner: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    organizerId: '4',
    organizerName: 'Khoa Vật lý',
    category: 'Vật lý',
    subject: 'Vật lý',
    difficulty: 'advanced',
    prizes: '30 triệu VNĐ + Cơ hội nghiên cứu',
    registrationStartDate: '2025-11-15T00:00:00',
    registrationEndDate: '2025-11-25T23:59:59',
    startDate: '2025-12-01T00:00:00',
    endDate: '2025-12-15T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 2 },
    participantCount: 67,
    teamCount: 45,
  },
  {
    id: '5',
    title: 'Cuộc thi Data Science',
    slug: 'cuoc-thi-data-science',
    description: 'Phân tích dữ liệu, xây dựng mô hình dự đoán và trình bày insights. Thử thách khoa học dữ liệu thực tế.',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    organizerId: '5',
    organizerName: 'CLB Khoa học Dữ liệu',
    category: 'Khoa học dữ liệu',
    subject: 'Khoa học máy tính',
    difficulty: 'intermediate',
    prizes: '80 triệu VNĐ + Kết nối doanh nghiệp',
    registrationStartDate: '2025-09-01T00:00:00',
    registrationEndDate: '2025-09-10T23:59:59',
    startDate: '2025-09-15T00:00:00',
    endDate: '2025-10-15T23:59:59',
    status: 'completed',
    teamSize: { min: 1, max: 5 },
    participantCount: 312,
    teamCount: 78,
  },
  {
    id: '6',
    title: 'Cuộc thi Thuyết trình Tiếng Anh',
    slug: 'cuoc-thi-thuyet-trinh-tieng-anh',
    description: 'Thể hiện khả năng thuyết trình và giao tiếp tiếng Anh của bạn trước ban giám khảo quốc tế.',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    organizerId: '6',
    organizerName: 'Trung tâm Anh ngữ Quốc tế',
    category: 'Ngoại ngữ',
    subject: 'Ngoại ngữ',
    difficulty: 'intermediate',
    prizes: '40 triệu VNĐ + Du học bổng',
    registrationStartDate: '2025-11-10T00:00:00',
    registrationEndDate: '2025-11-15T23:59:59',
    startDate: '2025-11-20T08:00:00',
    endDate: '2025-11-20T18:00:00',
    status: 'upcoming',
    teamSize: { min: 1, max: 1 },
    participantCount: 78,
    teamCount: 78,
  },
  {
    id: '7',
    title: 'Cuộc thi Khởi nghiệp Sinh viên',
    slug: 'cuoc-thi-khoi-nghiep-sinh-vien',
    description: 'Trình bày ý tưởng khởi nghiệp của bạn và tranh tài cùng các đội khác để giành quỹ đầu tư.',
    banner: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    organizerId: '7',
    organizerName: 'Quỹ Khởi nghiệp Việt',
    category: 'Khởi nghiệp',
    subject: 'Kinh doanh',
    difficulty: 'beginner',
    prizes: '200 triệu VNĐ + Quỹ đầu tư',
    registrationStartDate: '2025-11-15T00:00:00',
    registrationEndDate: '2025-12-05T23:59:59',
    startDate: '2025-12-10T09:00:00',
    endDate: '2025-12-12T17:00:00',
    status: 'upcoming',
    teamSize: { min: 3, max: 5 },
    participantCount: 145,
    teamCount: 34,
  },
  {
    id: '8',
    title: 'Cuộc thi Thiết kế UI/UX',
    slug: 'cuoc-thi-thiet-ke-ui-ux',
    description: 'Thiết kế giao diện người dùng và trải nghiệm người dùng cho một ứng dụng di động mới.',
    banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    organizerId: '8',
    organizerName: 'Design Hub Vietnam',
    category: 'Thiết kế',
    subject: 'Thiết kế',
    difficulty: 'intermediate',
    prizes: '35 triệu VNĐ + Laptop',
    registrationStartDate: '2025-11-10T00:00:00',
    registrationEndDate: '2025-11-20T23:59:59',
    startDate: '2025-11-25T00:00:00',
    endDate: '2025-11-28T23:59:59',
    status: 'upcoming',
    teamSize: { min: 1, max: 2 },
    participantCount: 92,
    teamCount: 56,
  },
  {
    id: '9',
    title: 'Cuộc thi Marketing Digital',
    slug: 'cuoc-thi-marketing-digital',
    description: 'Xây dựng chiến dịch marketing số cho một thương hiệu thực tế. Thể hiện sáng tạo và hiệu quả.',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    organizerId: '9',
    organizerName: 'Marketing Association',
    category: 'Marketing',
    subject: 'Marketing',
    difficulty: 'beginner',
    prizes: '25 triệu VNĐ + Internship',
    registrationStartDate: '2025-10-20T00:00:00',
    registrationEndDate: '2025-10-26T23:59:59',
    startDate: '2025-10-28T00:00:00',
    endDate: '2025-11-05T23:59:59',
    status: 'ongoing',
    teamSize: { min: 2, max: 4 },
    participantCount: 167,
    teamCount: 45,
  },
  {
    id: '10',
    title: 'Cuộc thi Hóa học Sáng tạo',
    slug: 'cuoc-thi-hoa-hoc-sang-tao',
    description: 'Thực hiện các thí nghiệm hóa học sáng tạo và trình bày kết quả nghiên cứu.',
    banner: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    organizerId: '10',
    organizerName: 'Viện Hóa học',
    category: 'Hóa học',
    subject: 'Hóa học',
    difficulty: 'advanced',
    prizes: '45 triệu VNĐ + Thiết bị lab',
    registrationStartDate: '2025-11-15T00:00:00',
    registrationEndDate: '2025-11-30T23:59:59',
    startDate: '2025-12-05T00:00:00',
    endDate: '2025-12-20T23:59:59',
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
        role: 'leader',
      },
      {
        userId: '2',
        userName: 'Sarah Johnson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        role: 'member',
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
        role: 'leader',
      },
      {
        userId: '4',
        userName: 'Emma Davis',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        role: 'member',
      },
      {
        userId: '5',
        userName: 'David Kim',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        role: 'member',
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

export { mockCompetitions as competitions, mockTeams as competitionTeams };

