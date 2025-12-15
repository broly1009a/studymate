import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PartnerRequest from '@/models/PartnerRequest';
import mongoose from 'mongoose';

// GET - Fetch single partner request
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
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findById(id)
      .populate('senderId', 'fullName avatar email')
      .populate('receiverId', 'fullName avatar email');

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: partnerRequest,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch partner request',
      },
      { status: 500 }
    );
  }
}

// PUT - Update partner request status (accept/reject)
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
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be accepted or rejected',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findById(id);

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    if (partnerRequest.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: 'Request has already been processed',
        },
        { status: 400 }
      );
    }

    partnerRequest.status = status;
    await partnerRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: `Partner request ${status} successfully`,
        data: partnerRequest,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update partner request',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete partner request
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
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findByIdAndDelete(id);

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Partner request deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete partner request',
      },
      { status: 500 }
    );
  }
}
