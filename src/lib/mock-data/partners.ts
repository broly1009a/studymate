// Mock data for study partners and matching

export interface StudyPartner {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  age: number;
  major: string;
  university: string;
  bio: string;
  subjects: string[];
  studyHours: number;
  rating: number;
  reviewsCount: number;
  availability: string[];
  studyStyle: string[];
  goals: string[];
  timezone: string;
  languages: string[];
  matchScore?: number;
  status: 'available' | 'busy' | 'offline';
  lastActive: string;
  sessionsCompleted: number;
  badges: string[];
}

export interface PartnerRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  subject: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  type?: 'sent' | 'received';
}

export interface StudySession {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  subject: string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  rating?: number;
  review?: string;
}

const mockPartners: StudyPartner[] = [
  {
    id: '1',
    userId: '2',
    name: 'Trần Khánh Linh',
    avatar: '/avt1.png',
    age: 21,
    major: 'Khoa học Máy tính',
    university: 'ĐH Bách Khoa Hà Nội',
    bio: 'Sinh viên ngành Khoa học Máy tính đam mê thuật toán và cấu trúc dữ liệu. Thích học nhóm và chia sẻ kiến thức!',
    subjects: ['Computer Science', 'Mathematics', 'Physics'],
    studyHours: 156,
    rating: 4.8,
    reviewsCount: 24,
    availability: ['Thứ 2: 14:00-17:00', 'Thứ 4: 15:00-18:00', 'Thứ 6: 13:00-16:00'],
    studyStyle: ['Trực quan', 'Hợp tác', 'Giải quyết vấn đề'],
    goals: ['Thành thạo thuật toán', 'Chuẩn bị phỏng vấn', 'Xây dựng dự án'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 95,
    status: 'available',
    lastActive: '2025-10-27T10:30:00',
    sessionsCompleted: 42,
    badges: ['Đóng góp tích cực', 'Nhiệt tình', 'Kiên trì'],
  },
  {
    id: '2',
    userId: '3',
    name: 'Nguyễn Hương Loan',
    avatar: '/avt2.png',
    age: 23,
    major: 'Vật lý',
    university: 'ĐH Khoa học Tự nhiên',
    bio: 'Đam mê vật lý và toán học. Thích giải thích các khái niệm phức tạp một cách đơn giản.',
    subjects: ['Physics', 'Mathematics', 'Chemistry'],
    studyHours: 203,
    rating: 4.9,
    reviewsCount: 31,
    availability: ['Thứ 3: 16:00-19:00', 'Thứ 5: 14:00-17:00', 'Thứ 7: 10:00-14:00'],
    studyStyle: ['Phân tích', 'Giảng dạy', 'Thực hành'],
    goals: ['Giúp đỡ người khác', 'Hiểu sâu kiến thức', 'Chuẩn bị nghiên cứu'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 88,
    status: 'available',
    lastActive: '2025-10-27T09:15:00',
    sessionsCompleted: 58,
    badges: ['Chuyên gia', 'Giáo viên kiên nhẫn', 'Đánh giá cao'],
  },
  {
    id: '3',
    userId: '4',
    name: 'Võ Quỳnh Anh',
    avatar: '/avt3.png',
    age: 20,
    major: 'Ngôn ngữ Anh',
    university: 'ĐH Ngoại ngữ Hà Nội',
    bio: 'Yêu thích văn học và lịch sử. Thích thảo luận ý tưởng và quan điểm khác nhau.',
    subjects: ['English Literature', 'History', 'Philosophy'],
    studyHours: 124,
    rating: 4.7,
    reviewsCount: 18,
    availability: ['Thứ 2: 18:00-21:00', 'Thứ 4: 17:00-20:00', 'Chủ nhật: 14:00-17:00'],
    studyStyle: ['Thảo luận', 'Đọc hiểu', 'Tư duy phản biện'],
    goals: ['Cải thiện viết', 'Chuẩn bị thi', 'Phân tích sâu'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Pháp'],
    matchScore: 82,
    status: 'busy',
    lastActive: '2025-10-27T08:45:00',
    sessionsCompleted: 35,
    badges: ['Sâu sắc', 'Giao tiếp tốt'],
  },
  {
    id: '4',
    userId: '5',
    name: 'Đỗ Quang Minh',
    avatar: '/avt4.png',
    age: 22,
    major: 'Kỹ thuật',
    university: 'ĐH Bách Khoa TP.HCM',
    bio: 'Sinh viên kỹ thuật tập trung vào ứng dụng thực tế. Học bằng thực hành.',
    subjects: ['Engineering', 'Mathematics', 'Computer Science'],
    studyHours: 178,
    rating: 4.6,
    reviewsCount: 22,
    availability: ['Thứ 3: 13:00-16:00', 'Thứ 5: 15:00-18:00', 'Thứ 6: 14:00-17:00'],
    studyStyle: ['Thực hành', 'Dự án', 'Hợp tác'],
    goals: ['Xây dựng kỹ năng', 'Chuẩn bị nghề nghiệp', 'Kết nối'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 79,
    status: 'available',
    lastActive: '2025-10-27T11:00:00',
    sessionsCompleted: 28,
    badges: ['Thực tế', 'Đáng tin cậy'],
  },
  {
    id: '5',
    userId: '6',
    name: 'Dương Công Chiến',
    avatar: '/avt5.png',
    age: 24,
    major: 'Sinh học',
    university: 'ĐH Quốc gia Hà Nội',
    bio: 'Chuyên ngành Sinh học với đam mê nghiên cứu. Yêu thích công việc phòng thí nghiệm.',
    subjects: ['Biology', 'Chemistry', 'Statistics'],
    studyHours: 145,
    rating: 4.8,
    reviewsCount: 26,
    availability: ['Thứ 2: 15:00-18:00', 'Thứ 4: 16:00-19:00', 'Thứ 7: 13:00-16:00'],
    studyStyle: ['Nghiên cứu', 'Chi tiết', 'Có phương pháp'],
    goals: ['Kỹ năng nghiên cứu', 'Kỹ thuật lab', 'Chuẩn bị cao học'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 75,
    status: 'offline',
    lastActive: '2025-10-26T18:30:00',
    sessionsCompleted: 31,
    badges: ['Tận tâm', 'Tỉ mỉ'],
  },
  {
    id: '6',
    userId: '10',
    name: 'Dương Văn Duy',
    avatar: '/avt6.png',
    age: 22,
    major: 'Quản trị kinh doanh',
    university: 'ĐH Kinh tế Quốc dân',
    bio: 'Sinh viên Quản trị kinh doanh quan tâm đến Marketing và Khởi nghiệp. Thích làm việc nhóm.',
    subjects: ['Business', 'Marketing', 'Economics'],
    studyHours: 132,
    rating: 4.5,
    reviewsCount: 19,
    availability: ['Thứ 2: 16:00-19:00', 'Thứ 5: 14:00-17:00', 'Thứ 7: 15:00-18:00'],
    studyStyle: ['Thảo luận', 'Case study', 'Hợp tác'],
    goals: ['Kỹ năng quản lý', 'Khởi nghiệp', 'Networking'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 72,
    status: 'available',
    lastActive: '2025-10-27T12:00:00',
    sessionsCompleted: 25,
    badges: ['Nhiệt huyết', 'Sáng tạo'],
  },
  // New Partners Added Below
  {
    id: '7',
    userId: '7',
    name: 'Lê Thị Thu Hiền',
    avatar: '/anh6_EXE.jpg',
    age: 22,
    major: 'Marketing',
    university: 'ĐH Kinh tế TP.HCM',
    bio: 'Sinh viên Marketing, đam mê nghiên cứu hành vi người tiêu dùng và chiến lược thương hiệu.',
    subjects: ['Nguyên lý Marketing', 'Hành vi người tiêu dùng', 'Nghiên cứu thị trường', 'Quản trị thương hiệu'],
    studyHours: 160,
    rating: 4.7,
    reviewsCount: 18,
    availability: ['Thứ 2: 10:00-13:00', 'Thứ 4: 14:00-17:00', 'Thứ 7: 09:00-12:00'],
    studyStyle: ['Chiến lược', 'Nghiên cứu thị trường', 'Phân tích hành vi khách hàng'],
    goals: ['Phát triển chiến lược marketing', 'Xây dựng thương hiệu', 'Quản lý dự án marketing'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 80,
    status: 'available',
    lastActive: '2025-10-27T10:00:00',
    sessionsCompleted: 30,
    badges: ['Nhiệt huyết', 'Sáng tạo'],
  },
  {
    id: '8',
    userId: '8',
    name: 'Dương Đức Công',
    avatar: '/anh8_EXE.jpg',
    age: 23,
    major: 'Trí tuệ Nhân tạo',
    university: 'ĐH Công nghệ thông tin',
    bio: 'Sinh viên chuyên ngành Trí tuệ Nhân tạo, đam mê học máy và các dự án AI.',
    subjects: ['Machine Learning', 'Deep Learning', 'Xử lý ngôn ngữ tự nhiên', 'AI Ethics & Governance'],
    studyHours: 180,
    rating: 4.9,
    reviewsCount: 25,
    availability: ['Thứ 3: 09:00-12:00', 'Thứ 5: 16:00-19:00', 'Thứ 7: 14:00-17:00'],
    studyStyle: ['Phân tích dữ liệu', 'Giải quyết vấn đề', 'Lập trình AI'],
    goals: ['Nghiên cứu AI', 'Xây dựng mô hình học sâu', 'Phát triển ứng dụng AI'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 85,
    status: 'busy',
    lastActive: '2025-10-27T11:30:00',
    sessionsCompleted: 38,
    badges: ['Chuyên gia', 'Lãnh đạo'],
  },
  {
    id: '9',
    userId: '9',
    name: 'Nguyễn Thị Mai Lan',
    avatar: '/anh7_EXE.jpg',
    age: 21,
    major: 'Ngôn ngữ Anh',
    university: 'ĐH Ngoại thương',
    bio: 'Sinh viên ngành Ngôn ngữ Anh với niềm đam mê biên – phiên dịch và giao tiếp quốc tế.',
    subjects: ['English for Business', 'Giao tiếp và văn hóa liên quốc gia', 'Dịch thuật chuyên ngành', 'Academic Writing & Research'],
    studyHours: 150,
    rating: 4.8,
    reviewsCount: 22,
    availability: ['Thứ 4: 10:00-13:00', 'Thứ 5: 14:00-17:00', 'Chủ nhật: 09:00-12:00'],
    studyStyle: ['Giao tiếp', 'Biên – Phiên dịch', 'Phân tích ngữ pháp'],
    goals: ['Cải thiện kỹ năng biên dịch', 'Nâng cao khả năng viết học thuật', 'Xây dựng sự nghiệp biên dịch'],
    timezone: 'GMT+7',
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    matchScore: 78,
    status: 'available',
    lastActive: '2025-10-27T09:00:00',
    sessionsCompleted: 27,
    badges: ['Sáng tạo', 'Tư duy phản biện'],
  },
];

const mockRequests: PartnerRequest[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Trần Khánh Linh',
    senderAvatar: '/avt1.png',
    receiverId: '1',
    receiverName: 'Current User',
    receiverAvatar: '/avt0.png',
    subject: 'Khoa học Máy tính',
    message: 'Chào bạn! Mình thấy bạn đang học thuật toán. Rất muốn cùng làm việc và giải quyết vấn đề với bạn!',
    status: 'pending',
    createdAt: '2025-10-27T09:00:00',
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Current User',
    senderAvatar: '/avt0.png',
    receiverId: '3',
    receiverName: 'Nguyễn Hương Loan',
    receiverAvatar: '/avt2.png',
    subject: 'Vật lý',
    message: 'Đang tìm bạn học cho môn cơ học lượng tử. Bạn có hứng thú không?',
    status: 'accepted',
    createdAt: '2025-10-26T14:30:00',
  },

];

const mockSessions: StudySession[] = [
  {
    id: '1',
    partnerId: '2',
    partnerName: 'Nguyễn Hương Loan',
    partnerAvatar: '/avt2.png',
    subject: 'Vật lý',
    scheduledAt: '2025-10-28T15:00:00',
    duration: 120,
    status: 'scheduled',
  },
  {
    id: '2',
    partnerId: '1',
    partnerName: 'Trần Khánh Linh',
    partnerAvatar: '/avt1.png',
    subject: 'Khoa học Máy tính',
    scheduledAt: '2025-10-25T14:00:00',
    duration: 90,
    status: 'completed',
    rating: 5,
    review: 'Buổi học tuyệt vời! Linh giải thích thuật toán rất rõ ràng.',
  },

];

export function getPartners(filters?: {
  subject?: string;
  availability?: string;
  minRating?: number;
  minMatchScore?: number;
}): StudyPartner[] {
  let filtered = [...mockPartners];

  if (filters?.subject && filters.subject !== 'all') {
    filtered = filtered.filter(p =>
      p.subjects.some(s => s.toLowerCase().includes(filters.subject!.toLowerCase()))
    );
  }

  if (filters?.minRating) {
    filtered = filtered.filter(p => p.rating >= filters.minRating!);
  }

  if (filters?.minMatchScore) {
    filtered = filtered.filter(p => (p.matchScore || 0) >= filters.minMatchScore!);
  }

  return filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

export function getPartnerById(id: string): StudyPartner | undefined {
  return mockPartners.find(p => p.id === id);
}

export function getPartnerRequests(type?: 'sent' | 'received'): PartnerRequest[] {
  if (type) {
    return mockRequests.filter(r => r.type === type);
  }
  return mockRequests;
}

export function getStudySessions(status?: 'scheduled' | 'completed' | 'cancelled'): StudySession[] {
  if (status) {
    return mockSessions.filter(s => s.status === status);
  }
  return mockSessions;
}

export function getPartnerStats() {
  return {
    totalPartners: mockPartners.length,
    activePartners: mockPartners.filter(p => p.status === 'available').length,
    totalSessions: mockSessions.length,
    completedSessions: mockSessions.filter(s => s.status === 'completed').length,
    pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
    averageRating: mockPartners.reduce((sum, p) => sum + p.rating, 0) / mockPartners.length,
  };
}

export { mockPartners as partners, mockRequests as partnerRequests };

