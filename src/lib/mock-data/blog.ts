// Mock data for Blog

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  commentsCount: number;
  readTime: number; // in minutes
  publishedAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
}

const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Học tập',
    slug: 'hoc-tap',
    description: 'Mẹo và phương pháp học tập hiệu quả',
    postCount: 15,
    color: 'blue',
  },
  {
    id: '2',
    name: 'Công nghệ',
    slug: 'cong-nghe',
    description: 'Tin tức và xu hướng công nghệ',
    postCount: 12,
    color: 'purple',
  },
  {
    id: '3',
    name: 'Kinh nghiệm',
    slug: 'kinh-nghiem',
    description: 'Chia sẻ kinh nghiệm học tập và thi cử',
    postCount: 20,
    color: 'green',
  },
  {
    id: '4',
    name: 'Sự kiện',
    slug: 'su-kien',
    description: 'Thông tin về các sự kiện và cuộc thi',
    postCount: 8,
    color: 'orange',
  },
];

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Phương pháp học tập hiệu quả cho sinh viên',
    slug: '10-phuong-phap-hoc-tap-hieu-qua',
    excerpt: 'Khám phá những phương pháp học tập được chứng minh khoa học giúp bạn ghi nhớ tốt hơn và đạt kết quả cao.',
    content: `# 10 Phương pháp học tập hiệu quả cho sinh viên

Học tập hiệu quả không chỉ là việc dành nhiều thời gian mà còn là việc áp dụng đúng phương pháp...

## 1. Kỹ thuật Pomodoro
Chia nhỏ thời gian học thành các khoảng 25 phút tập trung cao độ...

## 2. Active Recall
Thay vì đọc lại tài liệu, hãy tự kiểm tra bản thân...`,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    authorId: '1',
    authorName: 'Nguyễn Văn An',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
    category: 'Học tập',
    tags: ['học tập', 'phương pháp', 'hiệu quả', 'sinh viên'],
    views: 1250,
    likes: 89,
    commentsCount: 15,
    readTime: 8,
    publishedAt: '2025-10-20T10:00:00',
    updatedAt: '2025-10-20T10:00:00',
    status: 'published',
    featured: true,
  },
  {
    id: '2',
    title: 'Cách sử dụng AI để hỗ trợ học tập',
    slug: 'cach-su-dung-ai-ho-tro-hoc-tap',
    excerpt: 'Tìm hiểu cách tận dụng công nghệ AI như ChatGPT để nâng cao hiệu quả học tập của bạn.',
    content: `# Cách sử dụng AI để hỗ trợ học tập

AI đang thay đổi cách chúng ta học tập. Dưới đây là những cách hiệu quả nhất...`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    authorId: '2',
    authorName: 'Trần Thị Bình',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh',
    category: 'Công nghệ',
    tags: ['AI', 'công nghệ', 'học tập', 'ChatGPT'],
    views: 980,
    likes: 67,
    commentsCount: 12,
    readTime: 6,
    publishedAt: '2025-10-22T14:30:00',
    updatedAt: '2025-10-22T14:30:00',
    status: 'published',
    featured: true,
  },
  {
    id: '3',
    title: 'Kinh nghiệm thi đại học từ thủ khoa',
    slug: 'kinh-nghiem-thi-dai-hoc-thu-khoa',
    excerpt: 'Chia sẻ từ thủ khoa khối A về cách ôn thi hiệu quả và quản lý thời gian trong kỳ thi.',
    content: `# Kinh nghiệm thi đại học từ thủ khoa

Xin chào các bạn, mình là Minh, thủ khoa khối A năm nay...`,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    authorId: '3',
    authorName: 'Lê Văn Minh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
    category: 'Kinh nghiệm',
    tags: ['thi cử', 'đại học', 'kinh nghiệm', 'thủ khoa'],
    views: 2100,
    likes: 156,
    commentsCount: 28,
    readTime: 10,
    publishedAt: '2025-10-18T09:00:00',
    updatedAt: '2025-10-18T09:00:00',
    status: 'published',
    featured: true,
  },
  {
    id: '4',
    title: 'Cuộc thi lập trình ACM ICPC 2025',
    slug: 'cuoc-thi-lap-trinh-acm-icpc-2025',
    excerpt: 'Thông tin chi tiết về cuộc thi lập trình ACM ICPC 2025 và cách đăng ký tham gia.',
    content: `# Cuộc thi lập trình ACM ICPC 2025

ACM ICPC là cuộc thi lập trình lớn nhất thế giới...`,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    authorId: '4',
    authorName: 'Phạm Thị Dung',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dung',
    category: 'Sự kiện',
    tags: ['cuộc thi', 'lập trình', 'ACM ICPC', 'sự kiện'],
    views: 750,
    likes: 45,
    commentsCount: 8,
    readTime: 5,
    publishedAt: '2025-10-25T16:00:00',
    updatedAt: '2025-10-25T16:00:00',
    status: 'published',
    featured: false,
  },
  {
    id: '5',
    title: 'Cách ghi chú hiệu quả với phương pháp Cornell',
    slug: 'cach-ghi-chu-hieu-qua-cornell',
    excerpt: 'Phương pháp ghi chú Cornell giúp bạn tổ chức thông tin tốt hơn và ôn tập hiệu quả.',
    content: `# Cách ghi chú hiệu quả với phương pháp Cornell

Phương pháp Cornell được phát triển bởi giáo sư Walter Pauk...`,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    authorId: '1',
    authorName: 'Nguyễn Văn An',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
    category: 'Học tập',
    tags: ['ghi chú', 'Cornell', 'học tập', 'phương pháp'],
    views: 890,
    likes: 62,
    commentsCount: 10,
    readTime: 7,
    publishedAt: '2025-10-23T11:00:00',
    updatedAt: '2025-10-23T11:00:00',
    status: 'published',
    featured: false,
  },
];

const mockComments: BlogComment[] = [
  {
    id: '1',
    postId: '1',
    authorId: '5',
    authorName: 'Hoàng Văn Hùng',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hung',
    content: 'Bài viết rất hữu ích! Mình đã áp dụng kỹ thuật Pomodoro và thấy hiệu quả rõ rệt.',
    createdAt: '2025-10-21T10:30:00',
    likes: 12,
  },
  {
    id: '2',
    postId: '1',
    authorId: '6',
    authorName: 'Vũ Thị Lan',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan',
    content: 'Cảm ơn bạn đã chia sẻ! Mình sẽ thử Active Recall xem sao.',
    createdAt: '2025-10-21T14:20:00',
    likes: 8,
  },
];

export function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  authorId?: string;
}): BlogPost[] {
  let filtered = [...mockPosts];

  if (filters?.category) {
    filtered = filtered.filter(post => post.category === filters.category);
  }

  if (filters?.tag) {
    filtered = filtered.filter(post => post.tags.includes(filters.tag!));
  }

  if (filters?.status) {
    filtered = filtered.filter(post => post.status === filters.status);
  }

  if (filters?.featured !== undefined) {
    filtered = filtered.filter(post => post.featured === filters.featured);
  }

  if (filters?.authorId) {
    filtered = filtered.filter(post => post.authorId === filters.authorId);
  }

  return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return mockPosts.find(post => post.id === id);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find(post => post.slug === slug);
}

export function getBlogCategories(): BlogCategory[] {
  return mockCategories;
}

export function getBlogComments(postId: string): BlogComment[] {
  return mockComments
    .filter(comment => comment.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getBlogStats() {
  return {
    totalPosts: mockPosts.filter(p => p.status === 'published').length,
    totalViews: mockPosts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: mockPosts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: mockPosts.reduce((sum, post) => sum + post.commentsCount, 0),
  };
}

