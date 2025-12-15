import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import mongoose from 'mongoose';

// GET - Fetch single message
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
          message: 'Invalid message ID',
        },
        { status: 400 }
      );
    }

    const message = await Message.findById(id)
      .populate('senderId', 'fullName avatar email');

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch message',
      },
      { status: 500 }
    );
  }
}

// PUT - Update message
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
          message: 'Invalid message ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message not found',
        },
        { status: 404 }
      );
    }

    // Store edit history
    if (content && content !== message.content) {
      message.editHistory = message.editHistory || [];
      message.editHistory.push({
        content: message.content,
        editedAt: new Date(),
      });
      message.content = content;
      message.editedAt = new Date();
    }

    await message.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Message updated successfully',
        data: message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update message',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete message (soft delete)
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
          message: 'Invalid message ID',
        },
        { status: 400 }
      );
    }

    const message = await Message.findById(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Message not found',
        },
        { status: 404 }
      );
    }

    message.isDeleted = true;
    message.content = '[Message deleted]';
    await message.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Message deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete message',
      },
      { status: 500 }
    );
  }
}
