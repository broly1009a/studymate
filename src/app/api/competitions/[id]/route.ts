import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Competition from '@/models/Competition';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/api/auth';
import User from '@/models/User';

// GET - Fetch single competition
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid competition ID',
        },
        { status: 400 }
      );
    }

    const competition = await Competition.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('organizerId', 'fullName avatar email')
      .populate('participants', 'fullName avatar')
      .populate('winners', 'fullName avatar');

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Competition not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: competition,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch competition',
      },
      { status: 500 }
    );
  }
}

// PUT - Update competition
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid competition ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      posterImage,
      category,
      level,
      subject,
      rules,
      prizes,
      status,
      resultAnnounced,
    } = body;

    const competition = await Competition.findById(id);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Competition not found',
        },
        { status: 404 }
      );
    }

    // Authorization check - only owner or admin can edit
    if (
      competition.organizerId.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied - Only competition organizer or admin can edit',
        },
        { status: 403 }
      );
    }

    // Update fields
    if (title) competition.title = title;
    if (description) competition.description = description;
    if (posterImage !== undefined) competition.posterImage = posterImage;
    if (category) competition.category = category;
    if (level) competition.level = level;
    if (subject !== undefined) competition.subject = subject;
    if (rules !== undefined) competition.rules = rules;
    if (prizes !== undefined) competition.prizes = prizes;
    if (status) competition.status = status;
    if (resultAnnounced !== undefined) competition.resultAnnounced = resultAnnounced;

    await competition.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Competition updated successfully',
        data: competition,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update competition',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete competition
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid competition ID',
        },
        { status: 400 }
      );
    }

    const competition = await Competition.findById(id);

    if (!competition) {
      return NextResponse.json(
        {
          success: false,
          message: 'Competition not found',
        },
        { status: 404 }
      );
    }

    // Authorization check - only owner or admin can delete
    if (
      competition.organizerId.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied - Only competition organizer or admin can delete',
        },
        { status: 403 }
      );
    }

    await Competition.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Competition deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete competition',
      },
      { status: 500 }
    );
  }
}
