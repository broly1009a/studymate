// Mock data for 1-1 messaging system

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  reactions?: {
    emoji: string;
    userId: string;
  }[];
}

export interface Conversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  subject?: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    partnerId: '1',
    partnerName: 'Phạm Hà',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
    lastMessage: 'sao vậy',
    lastMessageTime: '2025-10-27T22:23:00',
    unreadCount: 3,
    isOnline: true,
    subject: 'Toán học',
  },
  {
    id: '2',
    partnerId: '2',
    partnerName: 'Nguyễn Tiến Anh',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenTienAnh',
    lastMessage: 'Reacted 👍 to your message',
    lastMessageTime: '2025-10-27T21:15:00',
    unreadCount: 1,
    isOnline: false,
    subject: 'Vật lý',
  },
  {
    id: '3',
    partnerId: '3',
    partnerName: 'Minh Lê',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhLe',
    lastMessage: 'Reacted ❤️ to your message',
    lastMessageTime: '2025-10-27T20:45:00',
    unreadCount: 0,
    isOnline: false,
    subject: 'Hóa học',
  },
  {
    id: '4',
    partnerId: '4',
    partnerName: 'Hà Nhật Tiến',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HaNhatTien',
    lastMessage: 'anh ơi add source cái đó em ...',
    lastMessageTime: '2025-10-27T19:30:00',
    unreadCount: 0,
    isOnline: true,
    subject: 'Lập trình',
  },
  {
    id: '5',
    partnerId: '5',
    partnerName: 'Lê Tuấn Kiệt',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeTuanKiet',
    lastMessage: 'À thằng ơi cho tao hỏi mới prj j...',
    lastMessageTime: '2025-10-27T18:20:00',
    unreadCount: 0,
    isOnline: false,
    subject: 'Tiếng Anh',
  },
  {
    id: '6',
    partnerId: '6',
    partnerName: 'Tuấn Anh',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TuanAnh',
    lastMessage: 'thôi xong accept mình ko j...',
    lastMessageTime: '2025-10-27T17:10:00',
    unreadCount: 0,
    isOnline: false,
    subject: 'Sinh học',
  },
  {
    id: '7',
    partnerId: '7',
    partnerName: 'Nguyễn Mai',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenMai',
    lastMessage: 'osu done rồi nhe :3',
    lastMessageTime: '2025-10-27T16:00:00',
    unreadCount: 0,
    isOnline: true,
    subject: 'Địa lý',
  },
  {
    id: '8',
    partnerId: '8',
    partnerName: 'Bến Nguyễn',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BenNguyen',
    lastMessage: 'Có lẽ là chưa ạ',
    lastMessageTime: '2025-10-27T15:30:00',
    unreadCount: 0,
    isOnline: false,
    subject: 'Lịch sử',
  },
  {
    id: '9',
    partnerId: '9',
    partnerName: 'Mỹ Tâm',
    partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MyTam',
    lastMessage: 'Anh ơi luôn ạ với ạ',
    lastMessageTime: '2025-10-27T14:00:00',
    unreadCount: 0,
    isOnline: false,
    subject: 'Văn học',
  },
];

const mockMessages: { [conversationId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'ơơi mấu rưa 🥰',
      timestamp: '2025-10-27T22:20:00',
      read: true,
      type: 'text',
    },
    {
      id: '2',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'Ịghai mấu hông a a',
      timestamp: '2025-10-27T22:21:00',
      read: true,
      type: 'text',
    },
    {
      id: '3',
      conversationId: '1',
      senderId: '1',
      senderName: 'Bạn',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
      content: '=))',
      timestamp: '2025-10-27T22:21:30',
      read: true,
      type: 'text',
    },
    {
      id: '4',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'nào anh :))',
      timestamp: '2025-10-27T22:22:00',
      read: true,
      type: 'text',
      reactions: [{ emoji: '😊', userId: '1' }],
    },
    {
      id: '5',
      conversationId: '1',
      senderId: 'me',
      senderName: 'Bạn',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
      content: 'mấu đỏ mỏi đề kiếm bạn',
      timestamp: '2025-10-27T22:22:30',
      read: true,
      type: 'text',
    },
    {
      id: '6',
      conversationId: '1',
      senderId: 'me',
      senderName: 'Bạn',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
      content: 'bạn học hay bạn thì tôy',
      timestamp: '2025-10-27T22:22:45',
      read: true,
      type: 'text',
    },
    {
      id: '7',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'em gửi cháy cho a tiên sửa nhà',
      timestamp: '2025-10-27T22:23:00',
      read: false,
      type: 'text',
    },
    {
      id: '8',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'nãy học mentor xong đây a',
      timestamp: '2025-10-27T22:23:15',
      read: false,
      type: 'text',
    },
    {
      id: '9',
      conversationId: '1',
      senderId: '1',
      senderName: 'Phạm Hà',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamHa',
      content: 'sao vậy',
      timestamp: '2025-10-27T22:23:30',
      read: false,
      type: 'text',
    },
  ],
  '2': [
    {
      id: '1',
      conversationId: '2',
      senderId: 'me',
      senderName: 'Bạn',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
      content: 'Chào bạn! Mình có thể học vật lý cùng nhau không?',
      timestamp: '2025-10-27T21:00:00',
      read: true,
      type: 'text',
    },
    {
      id: '2',
      conversationId: '2',
      senderId: '2',
      senderName: 'Nguyễn Tiến Anh',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenTienAnh',
      content: 'Được chứ! Mình đang học chương động lực học',
      timestamp: '2025-10-27T21:15:00',
      read: true,
      type: 'text',
      reactions: [{ emoji: '👍', userId: 'me' }],
    },
  ],
};

export function getConversations(): Conversation[] {
  return mockConversations;
}

export function getConversationById(id: string): Conversation | undefined {
  return mockConversations.find((c) => c.id === id);
}

export function getMessagesByConversationId(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

export function getUnreadCount(): number {
  return mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);
}

export { mockConversations as conversations };
export const messages = Object.values(mockMessages).flat();

