import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import mongoose from 'mongoose';

// POST - Mark message as read
export async function POST(
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

    if (!message.read) {
      message.read = true;
      message.readAt = new Date();
      await message.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message marked as read',
        data: message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to mark message as read',
      },
      { status: 500 }
    );
  }
}
