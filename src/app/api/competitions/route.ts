import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Competition from '@/models/Competition';

// GET - Fetch all competitions with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const competitions = await Competition.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ startDate: 1 })
      .populate('organizerId', 'fullName avatar')
      .populate('participants', 'fullName avatar');

    const total = await Competition.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: competitions,
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
        message: error.message || 'Failed to fetch competitions',
      },
      { status: 500 }
    );
  }
}

// POST - Create new competition
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      title,
      slug,
      description,
      posterImage,
      organizerId,
      organizerName,
      category,
      level,
      subject,
      rules,
      prizes,
      registrationStartDate,
      registrationEndDate,
      startDate,
      endDate,
      location,
      online,
      maxParticipants,
    } = body;

    // Validation
    if (
      !title ||
      !slug ||
      !description ||
      !organizerId ||
      !category ||
      !registrationStartDate ||
      !registrationEndDate ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCompetition = await Competition.findOne({ slug });
    if (existingCompetition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Competition slug already exists',
        },
        { status: 400 }
      );
    }

    // Create competition
    const competition = new Competition({
      title,
      slug,
      description,
      posterImage: posterImage || null,
      organizerId,
      organizerName,
      category,
      level: level || 'mixed',
      subject: subject || '',
      rules: rules || '',
      prizes: prizes || '',
      registrationStartDate: new Date(registrationStartDate),
      registrationEndDate: new Date(registrationEndDate),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location: location || null,
      online: online !== false,
      maxParticipants: maxParticipants || null,
      status: 'upcoming',
    });

    await competition.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Competition created successfully',
        data: competition,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create competition',
      },
      { status: 500 }
    );
  }
}
