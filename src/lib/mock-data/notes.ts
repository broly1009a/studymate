// Mock data for Notes

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isFavorite: boolean;
  folderId?: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  color: string;
  noteCount: number;
}

const mockFolders: NoteFolder[] = [
  { id: '1', name: 'Computer Science', color: 'blue', noteCount: 12 },
  { id: '2', name: 'Mathematics', color: 'green', noteCount: 8 },
  { id: '3', name: 'Physics', color: 'purple', noteCount: 5 },
];

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Binary Search Trees',
    content: '# Binary Search Trees\n\nA BST is a tree data structure where each node has at most two children...',
    subject: 'Data Structures',
    tags: ['algorithms', 'trees', 'data-structures'],
    createdAt: '2025-10-20T10:00:00',
    updatedAt: '2025-10-25T14:30:00',
    isPinned: true,
    isFavorite: true,
    folderId: '1',
  },
  {
    id: '2',
    title: 'Calculus Derivatives',
    content: '# Derivatives\n\nThe derivative represents the rate of change...',
    subject: 'Calculus',
    tags: ['calculus', 'derivatives', 'math'],
    createdAt: '2025-10-18T09:00:00',
    updatedAt: '2025-10-18T09:00:00',
    isPinned: false,
    isFavorite: true,
    folderId: '2',
  },
  {
    id: '3',
    title: 'Newton\'s Laws',
    content: '# Newton\'s Three Laws of Motion\n\n1. Law of Inertia...',
    subject: 'Physics',
    tags: ['physics', 'mechanics', 'laws'],
    createdAt: '2025-10-15T11:00:00',
    updatedAt: '2025-10-22T16:00:00',
    isPinned: false,
    isFavorite: false,
    folderId: '3',
  },
];

export function getNotes(filters?: {
  folderId?: string;
  search?: string;
  isPinned?: boolean;
  isFavorite?: boolean;
}): Note[] {
  let filtered = [...mockNotes];

  if (filters?.folderId) {
    filtered = filtered.filter(n => n.folderId === filters.folderId);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(search) ||
      n.content.toLowerCase().includes(search) ||
      n.tags.some(t => t.toLowerCase().includes(search))
    );
  }

  if (filters?.isPinned !== undefined) {
    filtered = filtered.filter(n => n.isPinned === filters.isPinned);
  }

  if (filters?.isFavorite !== undefined) {
    filtered = filtered.filter(n => n.isFavorite === filters.isFavorite);
  }

  return filtered.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function getNoteById(id: string): Note | undefined {
  return mockNotes.find(n => n.id === id);
}

export function getFolders(): NoteFolder[] {
  return mockFolders;
}

export function getNotesStats() {
  return {
    totalNotes: mockNotes.length,
    pinnedNotes: mockNotes.filter(n => n.isPinned).length,
    favoriteNotes: mockNotes.filter(n => n.isFavorite).length,
    totalFolders: mockFolders.length,
  };
}

