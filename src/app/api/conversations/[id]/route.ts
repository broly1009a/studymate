import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import mongoose from 'mongoose';

// GET - Fetch single conversation
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
          message: 'Invalid conversation ID',
        },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findById(id).populate(
      'participants',
      'fullName avatar email'
    );

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: conversation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch conversation',
      },
      { status: 500 }
    );
  }
}

// PUT - Update conversation
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
          message: 'Invalid conversation ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subject, isActive } = body;

    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    if (subject !== undefined) conversation.subject = subject;
    if (isActive !== undefined) conversation.isActive = isActive;

    await conversation.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Conversation updated successfully',
        data: conversation,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update conversation',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete conversation
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
          message: 'Invalid conversation ID',
        },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findByIdAndDelete(id);

    if (!conversation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Conversation not found',
        },
        { status: 404 }
      );
    }

    // Delete all messages in conversation
    await Message.deleteMany({ conversationId: id });

    return NextResponse.json(
      {
        success: true,
        message: 'Conversation deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete conversation',
      },
      { status: 500 }
    );
  }
}
