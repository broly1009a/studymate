// Mock data for Study Groups

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  category: string;
  subjects: string[];
  visibility: 'public' | 'private';
  memberCount: number;
  maxMembers: number;
  createdAt: string;
  ownerId: string;
  ownerName: string;
  isJoined?: boolean;
  unreadMessages?: number;
  upcomingEvents?: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  reputation: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface GroupResource {
  id: string;
  groupId: string;
  name: string;
  type: 'file' | 'folder' | 'link';
  size?: number;
  uploaderId: string;
  uploaderName: string;
  uploadedAt: string;
  tags: string[];
  parentId?: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'study_session' | 'meeting' | 'workshop' | 'social';
  creatorId: string;
  creatorName: string;
  attendees: { userId: string; status: 'going' | 'maybe' | 'not_going' | 'no_response' }[];
}

const mockGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Nhóm Thuật toán Nâng cao',
    description: 'Buổi học hàng tuần về thuật toán và cấu trúc dữ liệu nâng cao. Chuẩn bị cho phỏng vấn kỹ thuật.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=algo',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    category: 'Khoa học máy tính',
    subjects: ['Thuật toán', 'Cấu trúc dữ liệu', 'Giải quyết vấn đề'],
    visibility: 'public',
    memberCount: 24,
    maxMembers: 30,
    createdAt: '2025-09-15T10:00:00',
    ownerId: '1',
    ownerName: 'Sarah Chen',
    isJoined: true,
    unreadMessages: 5,
    upcomingEvents: 2,
  },
  {
    id: '2',
    name: 'Làm chủ Giải tích',
    description: 'Học tập cộng tác cho Giải tích I & II. Giải bài tập mỗi thứ Ba và thứ Năm.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=calc',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'Toán học',
    subjects: ['Giải tích', 'Toán học'],
    visibility: 'public',
    memberCount: 18,
    maxMembers: 25,
    createdAt: '2025-08-20T14:30:00',
    ownerId: '2',
    ownerName: 'Michael Brown',
    isJoined: true,
    unreadMessages: 2,
    upcomingEvents: 1,
  },
  {
    id: '3',
    name: 'Đội giải bài tập Vật lý',
    description: 'Cùng nhau giải quyết các bài toán vật lý khó. Tập trung vào cơ học, nhiệt động lực học và điện từ.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=physics',
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    category: 'Vật lý',
    subjects: ['Vật lý', 'Cơ học', 'Nhiệt động lực học'],
    visibility: 'public',
    memberCount: 15,
    maxMembers: 20,
    createdAt: '2025-10-01T09:00:00',
    ownerId: '3',
    ownerName: 'Emma Wilson',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 0,
  },
  {
    id: '4',
    name: 'Bootcamp Phát triển Web',
    description: 'Cùng học phát triển web hiện đại. React, Node.js, cơ sở dữ liệu và triển khai.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=webdev',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'Khoa học máy tính',
    subjects: ['Phát triển Web', 'JavaScript', 'React'],
    visibility: 'public',
    memberCount: 32,
    maxMembers: 40,
    createdAt: '2025-07-10T11:00:00',
    ownerId: '4',
    ownerName: 'David Kim',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 0,
  },
  {
    id: '5',
    name: 'Nhóm Hóa hữu cơ',
    description: 'Làm chủ các phản ứng và cơ chế hóa hữu cơ. Hỗ trợ báo cáo thí nghiệm và ôn thi.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=chem',
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
    category: 'Hóa học',
    subjects: ['Hóa hữu cơ', 'Hóa học'],
    visibility: 'private',
    memberCount: 12,
    maxMembers: 15,
    createdAt: '2025-09-05T13:00:00',
    ownerId: '5',
    ownerName: 'Lisa Anderson',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 0,
  },
  {
    id: '6',
    name: 'Nhóm học IELTS 7.5+',
    description: 'Luyện thi IELTS với mục tiêu 7.5 trở lên. Thực hành 4 kỹ năng, chữa bài Writing và Speaking.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=ielts',
    coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    category: 'Ngoại ngữ',
    subjects: ['Tiếng Anh', 'IELTS', 'Luyện thi'],
    visibility: 'public',
    memberCount: 28,
    maxMembers: 35,
    createdAt: '2025-06-12T08:00:00',
    ownerId: '6',
    ownerName: 'Nguyễn Văn A',
    isJoined: true,
    unreadMessages: 8,
    upcomingEvents: 3,
  },
  {
    id: '7',
    name: 'Lập trình Python từ Zero đến Hero',
    description: 'Học Python từ cơ bản đến nâng cao. Xây dựng dự án thực tế, học Machine Learning và Data Science.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=python',
    coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    category: 'Khoa học máy tính',
    subjects: ['Python', 'Lập trình', 'Data Science'],
    visibility: 'public',
    memberCount: 45,
    maxMembers: 50,
    createdAt: '2025-05-20T10:30:00',
    ownerId: '7',
    ownerName: 'Trần Thị B',
    isJoined: true,
    unreadMessages: 12,
    upcomingEvents: 1,
  },
  {
    id: '8',
    name: 'Kinh tế Vi mô - Vĩ mô',
    description: 'Nghiên cứu và thảo luận về kinh tế vi mô, vĩ mô. Phân tích các mô hình kinh tế và ứng dụng thực tế.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=econ',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    category: 'Kinh tế',
    subjects: ['Kinh tế vi mô', 'Kinh tế vĩ mô', 'Phân tích kinh tế'],
    visibility: 'public',
    memberCount: 22,
    maxMembers: 30,
    createdAt: '2025-08-05T14:00:00',
    ownerId: '8',
    ownerName: 'Lê Văn C',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 1,
  },
  {
    id: '9',
    name: 'Marketing Digital & Social Media',
    description: 'Học Marketing số, quản lý mạng xã hội, SEO/SEM, content marketing và phân tích dữ liệu.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=marketing',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'Marketing',
    subjects: ['Marketing Digital', 'Social Media', 'SEO'],
    visibility: 'public',
    memberCount: 38,
    maxMembers: 45,
    createdAt: '2025-07-18T09:30:00',
    ownerId: '9',
    ownerName: 'Phạm Thị D',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 2,
  },
  {
    id: '10',
    name: 'Nhóm ôn thi Đại học Khối A',
    description: 'Ôn thi THPT Quốc gia khối A (Toán, Lý, Hóa). Giải đề, chia sẻ kinh nghiệm và động viên nhau.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=hsexam',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    category: 'Ôn thi THPT',
    subjects: ['Toán', 'Vật lý', 'Hóa học'],
    visibility: 'public',
    memberCount: 56,
    maxMembers: 60,
    createdAt: '2025-04-10T07:00:00',
    ownerId: '10',
    ownerName: 'Hoàng Văn E',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 4,
  },
  {
    id: '11',
    name: 'UI/UX Design - Figma to Reality',
    description: 'Thiết kế giao diện người dùng chuyên nghiệp. Từ wireframe, prototype đến thiết kế hoàn chỉnh.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=uiux',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Thiết kế',
    subjects: ['UI/UX', 'Figma', 'Design Thinking'],
    visibility: 'public',
    memberCount: 27,
    maxMembers: 35,
    createdAt: '2025-06-25T11:00:00',
    ownerId: '11',
    ownerName: 'Đỗ Thị F',
    isJoined: true,
    unreadMessages: 3,
    upcomingEvents: 1,
  },
  {
    id: '12',
    name: 'Tiếng Nhật N3 - N2',
    description: 'Luyện thi năng lực tiếng Nhật JLPT N3 và N2. Thực hành nghe, đọc, từ vựng và ngữ pháp.',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=japanese',
    coverImage: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
    category: 'Ngoại ngữ',
    subjects: ['Tiếng Nhật', 'JLPT', 'Luyện thi'],
    visibility: 'public',
    memberCount: 19,
    maxMembers: 25,
    createdAt: '2025-09-01T13:30:00',
    ownerId: '12',
    ownerName: 'Vũ Văn G',
    isJoined: false,
    unreadMessages: 0,
    upcomingEvents: 2,
  },
];

const mockMembers: GroupMember[] = [
  {
    id: '1',
    groupId: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'owner',
    joinedAt: '2025-09-15T10:00:00',
    reputation: 1250,
  },
  {
    id: '2',
    groupId: '1',
    userId: '2',
    userName: 'Michael Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'admin',
    joinedAt: '2025-09-16T14:30:00',
    reputation: 890,
  },
  {
    id: '3',
    groupId: '1',
    userId: '3',
    userName: 'Emma Wilson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    role: 'member',
    joinedAt: '2025-09-18T09:00:00',
    reputation: 645,
  },
];

const mockMessages: GroupMessage[] = [
  {
    id: '1',
    groupId: '1',
    userId: '1',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Hey everyone! Don\'t forget our study session tomorrow at 3 PM. We\'ll be covering dynamic programming.',
    createdAt: '2025-10-27T10:30:00',
    reactions: [
      { emoji: '👍', count: 5, users: ['2', '3', '4', '5', '6'] },
      { emoji: '🔥', count: 2, users: ['2', '3'] },
    ],
  },
  {
    id: '2',
    groupId: '1',
    userId: '2',
    userName: 'Michael Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: 'I\'ll be there! Can we also review the knapsack problem?',
    createdAt: '2025-10-27T10:45:00',
  },
];

const mockResources: GroupResource[] = [
  {
    id: '1',
    groupId: '1',
    name: 'Dynamic Programming Notes.pdf',
    type: 'file',
    size: 2048576,
    uploaderId: '1',
    uploaderName: 'Sarah Chen',
    uploadedAt: '2025-10-25T14:00:00',
    tags: ['algorithms', 'dp', 'notes'],
  },
  {
    id: '2',
    groupId: '1',
    name: 'Practice Problems',
    type: 'folder',
    uploaderId: '1',
    uploaderName: 'Sarah Chen',
    uploadedAt: '2025-10-20T10:00:00',
    tags: ['practice'],
  },
];

const mockEvents: GroupEvent[] = [
  {
    id: '1',
    groupId: '1',
    title: 'Dynamic Programming Study Session',
    description: 'We\'ll cover common DP patterns and solve practice problems together.',
    startTime: '2025-10-28T15:00:00',
    endTime: '2025-10-28T17:00:00',
    location: 'Online - Zoom',
    type: 'study_session',
    creatorId: '1',
    creatorName: 'Sarah Chen',
    attendees: [
      { userId: '1', status: 'going' },
      { userId: '2', status: 'going' },
      { userId: '3', status: 'maybe' },
    ],
  },
];

export function getGroups(filters?: {
  category?: string;
  subject?: string;
  visibility?: 'public' | 'private';
  search?: string;
}): StudyGroup[] {
  let filtered = [...mockGroups];

  if (filters?.category) {
    filtered = filtered.filter(g => g.category === filters.category);
  }

  if (filters?.subject) {
    filtered = filtered.filter(g =>
      g.subjects.some(s => s.toLowerCase().includes(filters.subject!.toLowerCase()))
    );
  }

  if (filters?.visibility) {
    filtered = filtered.filter(g => g.visibility === filters.visibility);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(g =>
      g.name.toLowerCase().includes(search) ||
      g.description.toLowerCase().includes(search)
    );
  }

  return filtered;
}

export function getGroupById(id: string): StudyGroup | undefined {
  return mockGroups.find(g => g.id === id);
}

export function getGroupMembers(groupId: string): GroupMember[] {
  return mockMembers;
}

export function getGroupMessages(groupId: string): GroupMessage[] {
  return mockMessages.filter(m => m.groupId === groupId);
}

export function getGroupResources(groupId: string): GroupResource[] {
  return mockResources.filter(r => r.groupId === groupId);
}

export function getGroupEvents(groupId: string): GroupEvent[] {
  return mockEvents.filter(e => e.groupId === groupId);
}

export function getMyGroups(): StudyGroup[] {
  return mockGroups.filter(g => g.isJoined);
}

export function getGroupStats() {
  return {
    totalGroups: mockGroups.length,
    publicGroups: mockGroups.filter(g => g.visibility === 'public').length,
    myGroups: mockGroups.filter(g => g.isJoined).length,
    totalMembers: mockGroups.reduce((sum, g) => sum + g.memberCount, 0),
  };
}

export { mockGroups as studyGroups, mockMembers as groupMembers, mockMessages as groupMessages };

