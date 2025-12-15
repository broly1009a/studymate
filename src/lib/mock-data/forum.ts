// Mock data for Q&A Forum

export interface Question {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorReputation: number;
  subject: string;
  tags: string[];
  views: number;
  votes: number;
  answersCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'answered' | 'closed';
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorReputation: number;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  parentId: string;
  parentType: 'question' | 'answer';
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    title: 'Làm thế nào để giải phương trình bậc hai bằng công thức nghiệm?',
    content: 'Tôi đang gặp khó khăn trong việc hiểu khi nào nên dùng công thức nghiệm và khi nào nên phân tích thành nhân tử. Ai có thể giải thích các bước rõ ràng với ví dụ không?',
    authorId: '1',
    authorName: 'Minh Anh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    authorReputation: 245,
    subject: 'Toán học',
    tags: ['đại-số', 'phương-trình-bậc-hai', 'công-thức'],
    views: 156,
    votes: 12,
    answersCount: 3,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-25T10:30:00',
    updatedAt: '2025-10-26T14:20:00',
    status: 'answered',
  },
  {
    id: '2',
    title: 'Sự khác biệt giữa bộ nhớ stack và heap là gì?',
    content: 'Tôi cứ nghe về stack và heap trong lớp CS nhưng chưa hiểu rõ sự khác biệt. Ai có thể giải thích với ví dụ được không?',
    authorId: '2',
    authorName: 'Thu Hà',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    authorReputation: 189,
    subject: 'Khoa học máy tính',
    tags: ['quản-lý-bộ-nhớ', 'cấu-trúc-dữ-liệu', 'lập-trình'],
    views: 234,
    votes: 18,
    answersCount: 5,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-24T15:45:00',
    updatedAt: '2025-10-25T09:30:00',
    status: 'answered',
  },
  {
    id: '3',
    title: 'Quang hợp ở thực vật C4 hoạt động như thế nào?',
    content: 'Tôi hiểu quang hợp cơ bản nhưng thực vật C4 dường như có cơ chế khác. Điều gì làm chúng đặc biệt?',
    authorId: '3',
    authorName: 'Hoàng Long',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    authorReputation: 312,
    subject: 'Sinh học',
    tags: ['quang-hợp', 'sinh-học-thực-vật', 'sinh-hóa'],
    views: 89,
    votes: 7,
    answersCount: 2,
    hasAcceptedAnswer: false,
    createdAt: '2025-10-27T08:15:00',
    updatedAt: '2025-10-27T08:15:00',
    status: 'open',
  },
  {
    id: '4',
    title: 'Giải thích Định luật III Newton với ví dụ thực tế',
    content: 'Tôi cần giúp đỡ để hiểu các cặp tác dụng-phản tác dụng. Ví dụ trong sách giáo khoa rất khó hiểu.',
    authorId: '4',
    authorName: 'Lan Anh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    authorReputation: 156,
    subject: 'Vật lý',
    tags: ['cơ-học', 'định-luật-newton', 'lực'],
    views: 178,
    votes: 15,
    answersCount: 4,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-23T12:00:00',
    updatedAt: '2025-10-24T16:30:00',
    status: 'answered',
  },
  {
    id: '5',
    title: 'Best practices cho React hooks?',
    content: 'Tôi mới học React hooks. Những lỗi phổ biến cần tránh và best practices cần tuân theo là gì?',
    authorId: '5',
    authorName: 'Quang Huy',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    authorReputation: 421,
    subject: 'Khoa học máy tính',
    tags: ['react', 'javascript', 'phát-triển-web'],
    views: 312,
    votes: 24,
    answersCount: 6,
    hasAcceptedAnswer: false,
    createdAt: '2025-10-26T14:20:00',
    updatedAt: '2025-10-27T10:15:00',
    status: 'open',
  },
  {
    id: '6',
    title: 'Cách tối ưu hóa câu lệnh SQL query?',
    content: 'Database của tôi đang chạy chậm với các query phức tạp. Có tips nào để tối ưu hóa không?',
    authorId: '6',
    authorName: 'Đức Anh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Duc',
    authorReputation: 567,
    subject: 'Khoa học máy tính',
    tags: ['sql', 'database', 'tối-ưu-hóa', 'performance'],
    views: 423,
    votes: 31,
    answersCount: 8,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-22T09:15:00',
    updatedAt: '2025-10-23T16:45:00',
    status: 'answered',
  },
  {
    id: '7',
    title: 'Phản ứng oxi hóa khử trong hóa học vô cơ',
    content: 'Làm sao để cân bằng phương trình oxi hóa khử một cách hiệu quả? Tôi luôn bị nhầm lẫn với số oxi hóa.',
    authorId: '7',
    authorName: 'Mai Phương',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mai',
    authorReputation: 298,
    subject: 'Hóa học',
    tags: ['hóa-học-vô-cơ', 'oxi-hóa-khử', 'phương-trình'],
    views: 167,
    votes: 13,
    answersCount: 4,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-21T14:30:00',
    updatedAt: '2025-10-22T11:20:00',
    status: 'answered',
  },
  {
    id: '8',
    title: 'Chiến lược marketing cho startup công nghệ',
    content: 'Startup của tôi đang cần tư vấn về chiến lược marketing với ngân sách hạn chế. Nên bắt đầu từ đâu?',
    authorId: '8',
    authorName: 'Tuấn Kiệt',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan',
    authorReputation: 445,
    subject: 'Marketing',
    tags: ['marketing-digital', 'startup', 'chiến-lược', 'social-media'],
    views: 589,
    votes: 42,
    answersCount: 12,
    hasAcceptedAnswer: false,
    createdAt: '2025-10-20T10:00:00',
    updatedAt: '2025-10-27T09:30:00',
    status: 'open',
  },
  {
    id: '9',
    title: 'Nguyên tắc thiết kế UI/UX cho mobile app',
    content: 'Tôi đang thiết kế app đầu tiên. Những nguyên tắc cơ bản về UX cho mobile mà tôi cần biết là gì?',
    authorId: '9',
    authorName: 'Ngọc Linh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linh',
    authorReputation: 234,
    subject: 'Thiết kế',
    tags: ['ui-ux', 'mobile-design', 'user-experience', 'app-design'],
    views: 345,
    votes: 28,
    answersCount: 7,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-19T16:45:00',
    updatedAt: '2025-10-20T14:30:00',
    status: 'answered',
  },
  {
    id: '10',
    title: 'Luyện Speaking IELTS hiệu quả như thế nào?',
    content: 'Điểm Speaking của tôi luôn thấp hơn các kỹ năng khác. Có phương pháp nào để cải thiện không?',
    authorId: '10',
    authorName: 'Bảo Trâm',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tram',
    authorReputation: 178,
    subject: 'Ngoại ngữ',
    tags: ['ielts', 'speaking', 'tiếng-anh', 'luyện-thi'],
    views: 512,
    votes: 37,
    answersCount: 9,
    hasAcceptedAnswer: false,
    createdAt: '2025-10-18T13:20:00',
    updatedAt: '2025-10-27T08:45:00',
    status: 'open',
  },
  {
    id: '11',
    title: 'Phân tích SWOT trong quản trị kinh doanh',
    content: 'Làm thế nào để thực hiện phân tích SWOT một cách chính xác cho doanh nghiệp nhỏ?',
    authorId: '11',
    authorName: 'Hoàng Nam',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nam',
    authorReputation: 389,
    subject: 'Kinh doanh',
    tags: ['swot', 'quản-trị', 'chiến-lược-kinh-doanh', 'phân-tích'],
    views: 267,
    votes: 19,
    answersCount: 5,
    hasAcceptedAnswer: true,
    createdAt: '2025-10-17T11:00:00',
    updatedAt: '2025-10-18T15:30:00',
    status: 'answered',
  },
  {
    id: '12',
    title: 'Cách học từ vựng tiếng Nhật hiệu quả',
    content: 'Tôi đang học N3 nhưng khó nhớ Kanji và từ vựng. Có phương pháp nào tốt hơn ghi nhớ máy móc không?',
    authorId: '12',
    authorName: 'Thanh Hương',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huong',
    authorReputation: 201,
    subject: 'Ngoại ngữ',
    tags: ['tiếng-nhật', 'kanji', 'từ-vựng', 'n3'],
    views: 398,
    votes: 26,
    answersCount: 6,
    hasAcceptedAnswer: false,
    createdAt: '2025-10-16T09:30:00',
    updatedAt: '2025-10-26T12:15:00',
    status: 'open',
  },
];

const mockAnswers: Answer[] = [
  {
    id: '1',
    questionId: '1',
    content: 'Công thức nghiệm là x = (-b ± √(b²-4ac)) / 2a. Sử dụng khi:\n1. Phương trình không thể phân tích nhân tử dễ dàng\n2. Cần nghiệm chính xác\n3. Làm việc với số phức\n\nVí dụ: x² + 5x + 6 = 0\na=1, b=5, c=6\nx = (-5 ± √(25-24)) / 2 = (-5 ± 1) / 2\nNghiệm: x = -2 hoặc x = -3',
    authorId: '6',
    authorName: 'GS. Minh Tuấn',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martinez',
    authorReputation: 1250,
    votes: 15,
    isAccepted: true,
    createdAt: '2025-10-25T11:00:00',
    updatedAt: '2025-10-25T11:00:00',
  },
  {
    id: '2',
    questionId: '2',
    content: 'Bộ nhớ Stack:\n- Lưu trữ biến cục bộ và lời gọi hàm\n- Tự động quản lý (LIFO)\n- Truy cập nhanh\n- Kích thước giới hạn\n- Biến tự động giải phóng\n\nBộ nhớ Heap:\n- Lưu trữ đối tượng được cấp phát động\n- Quản lý thủ công (trong C/C++)\n- Truy cập chậm hơn\n- Kích thước lớn hơn\n- Phải giải phóng thủ công\n\nVí dụ trong C++:\nint x = 5; // Stack\nint* ptr = new int(5); // Heap',
    authorId: '7',
    authorName: 'TS. Hoàng Phúc',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thompson',
    authorReputation: 2100,
    votes: 22,
    isAccepted: true,
    createdAt: '2025-10-24T16:30:00',
    updatedAt: '2025-10-24T16:30:00',
  },
  {
    id: '3',
    questionId: '6',
    content: 'Một số cách tối ưu SQL query:\n\n1. Sử dụng INDEX hợp lý\n2. Tránh SELECT * - chỉ lấy cột cần thiết\n3. Sử dụng EXPLAIN để phân tích query\n4. Tối ưu JOIN và WHERE clauses\n5. Sử dụng query caching khi có thể\n6. Partition table cho dữ liệu lớn\n\nVí dụ tối ưu:\n-- Chậm\nSELECT * FROM users WHERE YEAR(created_at) = 2024\n\n-- Nhanh\nSELECT id, name FROM users WHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'',
    authorId: '13',
    authorName: 'Phạm Văn An',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
    authorReputation: 1540,
    votes: 38,
    isAccepted: true,
    createdAt: '2025-10-22T11:30:00',
    updatedAt: '2025-10-22T11:30:00',
  },
];

const mockComments: Comment[] = [
  {
    id: '1',
    parentId: '1',
    parentType: 'answer',
    content: 'Great explanation! This really helped me understand.',
    authorId: '1',
    authorName: 'Alex Chen',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    createdAt: '2025-10-25T12:00:00',
  },
  {
    id: '2',
    parentId: '2',
    parentType: 'answer',
    content: 'Could you explain more about garbage collection?',
    authorId: '2',
    authorName: 'Sarah Johnson',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: '2025-10-24T17:00:00',
  },
];

export function getQuestions(filters?: {
  subject?: string;
  status?: 'open' | 'answered' | 'closed';
  tag?: string;
  search?: string;
}): Question[] {
  let filtered = [...mockQuestions];

  if (filters?.subject) {
    filtered = filtered.filter(q => q.subject === filters.subject);
  }

  if (filters?.status) {
    filtered = filtered.filter(q => q.status === filters.status);
  }

  if (filters?.tag) {
    filtered = filtered.filter(q => q.tags.includes(filters.tag!));
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(q =>
      q.title.toLowerCase().includes(search) ||
      q.content.toLowerCase().includes(search) ||
      q.tags.some(t => t.toLowerCase().includes(search))
    );
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getQuestionById(id: string): Question | undefined {
  return mockQuestions.find(q => q.id === id);
}

export function getAnswers(questionId: string): Answer[] {
  return mockAnswers
    .filter(a => a.questionId === questionId)
    .sort((a, b) => {
      if (a.isAccepted) return -1;
      if (b.isAccepted) return 1;
      return b.votes - a.votes;
    });
}

export function getComments(parentId: string, parentType: 'question' | 'answer'): Comment[] {
  return mockComments
    .filter(c => c.parentId === parentId && c.parentType === parentType)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getForumStats() {
  return {
    totalQuestions: mockQuestions.length,
    openQuestions: mockQuestions.filter(q => q.status === 'open').length,
    answeredQuestions: mockQuestions.filter(q => q.status === 'answered').length,
    totalAnswers: mockAnswers.length,
    totalViews: mockQuestions.reduce((sum, q) => sum + q.views, 0),
    averageAnswers: mockAnswers.length / mockQuestions.length,
  };
}

export function getPopularTags() {
  const tagCounts: Record<string, number> = {};
  mockQuestions.forEach(q => {
    q.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export { mockQuestions as forumQuestions, mockAnswers as forumAnswers };

