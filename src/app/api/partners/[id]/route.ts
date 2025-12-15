import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import mongoose from 'mongoose';

// GET - Fetch single partner by ID
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
          message: 'Invalid partner ID',
        },
        { status: 400 }
      );
    }

    const partner = await Partner.findById(id).populate(
      'userId',
      'fullName email phone'
    );

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: partner,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch partner',
      },
      { status: 500 }
    );
  }
}

// PUT - Update partner profile
export async function PUT(
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
          message: 'Invalid partner ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      bio,
      avatar,
      subjects,
      availability,
      studyStyle,
      goals,
      timezone,
      languages,
      status,
    } = body;

    const partner = await Partner.findById(id);

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner not found',
        },
        { status: 404 }
      );
    }

    // Update fields
    if (bio !== undefined) partner.bio = bio;
    if (avatar !== undefined) partner.avatar = avatar;
    if (subjects) partner.subjects = subjects;
    if (availability) partner.availability = availability;
    if (studyStyle) partner.studyStyle = studyStyle;
    if (goals) partner.goals = goals;
    if (timezone) partner.timezone = timezone;
    if (languages) partner.languages = languages;
    if (status) partner.status = status;

    await partner.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Partner profile updated successfully',
        data: partner,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update partner',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete partner profile
export async function DELETE(
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
          message: 'Invalid partner ID',
        },
        { status: 400 }
      );
    }

    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Partner profile deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete partner',
      },
      { status: 500 }
    );
  }
}
