import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/api/auth';

// Mock user profile data - replace with DB query
const mockProfiles: Record<string, any> = {
  '1': {
    id: '1',
    username: 'Duy Anh',
    email: 'DuyAnh@example.com',
    fullName: 'Duy Anh',
    avatar: '/avatar.png',
    coverPhoto: '/cover.png',
    bio: 'Tớ là người có 3 năm kinh nghiệm lập trình bên frontend, và có học qua sơ lược về kinh tế vĩ mô',
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
    ],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

/**
 * GET /api/profiles/me
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // In real app, fetch from database using decoded.id
    const profile = mockProfiles[decoded.id];

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profiles/me
 * Update current user's profile
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // In real app, validate with Zod schema and update database
    const updatedProfile = {
      ...mockProfiles[decoded.id],
      fullName: body.fullName || mockProfiles[decoded.id].fullName,
      bio: body.bio || mockProfiles[decoded.id].bio,
      avatar: body.avatar || mockProfiles[decoded.id].avatar,
      coverPhoto: body.coverPhoto || mockProfiles[decoded.id].coverPhoto,
      education: body.education || mockProfiles[decoded.id].education,
      skills: body.skills || mockProfiles[decoded.id].skills,
      socialLinks: body.socialLinks || mockProfiles[decoded.id].socialLinks,
      updatedAt: new Date().toISOString(),
    };

    // Update mock data
    mockProfiles[decoded.id] = updatedProfile;

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
