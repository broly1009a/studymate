import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';
import { verifyToken } from '@/lib/api/auth';
import { calculateMatchScore } from '@/lib/matching-algorithm';

// GET - Fetch all partners with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get current user for match scoring (optional)
    const authHeader = request.headers.get('authorization');
    let currentUserId: string | null = null;
    let currentUserData: any = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      if (decoded) {
        currentUserId = decoded.id;
        
        // Fetch current user's matching data
        const user = await User.findById(currentUserId);
        const userProfile = await UserProfile.findOne({ userId: currentUserId });
        
        if (user && userProfile) {
          currentUserData = {
            university: userProfile.education?.institution,
            major: userProfile.education?.major,
            learningNeeds: userProfile.learningNeeds || [],
            learningGoals: userProfile.learningGoals || [],
            studyHabits: userProfile.studyHabits || [],
            mbtiType: userProfile.mbtiType,
            age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : undefined,
          };
        }
      }
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const minMatchScore = parseInt(searchParams.get('minMatchScore') || '0');
    const search = searchParams.get('search');
    const university = searchParams.get('university');
    const major = searchParams.get('major');

    const skip = (page - 1) * limit;
    let query: any = {};

    // Exclude current user's own partner profile
    if (currentUserId) {
      query.userId = { $ne: currentUserId };
    }

    if (status) {
      query.status = status;
    }

    if (subject) {
      query.subjects = { $in: [new RegExp(subject, 'i')] };
    }

    if (minRating > 0) {
      query.rating = { $gte: minRating };
    }

    if (minMatchScore > 0) {
      query.matchScore = { $gte: minMatchScore };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } },
      ];
    }

    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }

    if (major) {
      query.major = { $regex: major, $options: 'i' };
    }

    const partners = await Partner.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ rating: -1 }) // Sort by rating first, matchScore will be calculated
      .populate('userId', 'fullName email')
      .lean(); // Use lean() for better performance

    // Calculate match scores if user is logged in
    let partnersWithMatchScore = partners;
    if (currentUserData) {
      partnersWithMatchScore = partners.map((partner: any) => {
        const matchScore = calculateMatchScore(currentUserData, {
          university: partner.university,
          major: partner.major,
          subjects: partner.subjects || [],
          goals: partner.goals || [],
          studyStyle: partner.studyStyle || [],
          age: partner.age,
        });

        return {
          ...partner,
          matchScore,
        };
      });

      // Sort by matchScore after calculation
      partnersWithMatchScore.sort((a: any, b: any) => 
        (b.matchScore || 0) - (a.matchScore || 0)
      );

      // Filter by minMatchScore if provided
      if (minMatchScore > 0) {
        partnersWithMatchScore = partnersWithMatchScore.filter(
          (p: any) => (p.matchScore || 0) >= minMatchScore
        );
      }
    } else {
      // If no user logged in, set matchScore to 0
      partnersWithMatchScore = partners.map((partner: any) => ({
        ...partner,
        matchScore: 0,
      }));
    }

    const total = await Partner.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: partnersWithMatchScore,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        hasMatchScoring: !!currentUserData, // Indicate if match scoring was applied
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch partners',
      },
      { status: 500 }
    );
  }
}

// POST - Create partner profile
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      name,
      avatar,
      age,
      major,
      university,
      bio,
      subjects,
      availability,
      studyStyle,
      goals,
      timezone,
      languages,
    } = body;

    // Validation
    if (
      !userId ||
      !name ||
      !age ||
      !major ||
      !university ||
      !subjects ||
      subjects.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if partner already exists
    const existingPartner = await Partner.findOne({ userId });
    if (existingPartner) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner profile already exists for this user',
        },
        { status: 400 }
      );
    }

    // Create partner profile
    const partner = new Partner({
      userId,
      name,
      avatar,
      age,
      major,
      university,
      bio: bio || '',
      subjects,
      availability: availability || [],
      studyStyle: studyStyle || [],
      goals: goals || [],
      timezone: timezone || 'GMT+7',
      languages: languages || ['Tiếng Việt'],
      status: 'offline',
    });

    await partner.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Partner profile created successfully',
        data: partner,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create partner profile',
      },
      { status: 500 }
    );
  }
}
