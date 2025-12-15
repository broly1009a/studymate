import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/models/Partner';

// GET - Fetch all partners with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const minMatchScore = parseInt(searchParams.get('minMatchScore') || '0');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    let query: any = {};

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
      query.$text = { $search: search };
    }

    const partners = await Partner.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ matchScore: -1, rating: -1 })
      .populate('userId', 'fullName email');

    const total = await Partner.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: partners,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
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
