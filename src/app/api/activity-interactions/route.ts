import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserActivityInteraction from '@/models/UserActivityInteraction';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

// POST - Track user interaction with an activity
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Authentication required',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { activityId, activityType, action, source, metadata } = body;

    // Validation
    if (!activityId || !activityType || !action || !source) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: activityId, activityType, action, source',
        },
        { status: 400 }
      );
    }

    // Create or update interaction
    const interaction = await UserActivityInteraction.findOneAndUpdate(
      {
        userId: user._id,
        activityId,
        activityType,
        action,
      },
      {
        userId: user._id,
        activityId,
        activityType,
        action,
        source,
        metadata: metadata || {},
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Interaction tracked successfully',
        data: interaction,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: true,
          message: 'Interaction already tracked',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to track interaction',
      },
      { status: 500 }
    );
  }
}

// GET - Get user's interactions
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Authentication required',
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const activityType = searchParams.get('activityType');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = { userId: decoded.id };
    if (activityType) query.activityType = activityType;
    if (action) query.action = action;

    const interactions = await UserActivityInteraction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: interactions,
        count: interactions.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch interactions',
      },
      { status: 500 }
    );
  }
}
