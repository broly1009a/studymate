import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupMessage from '@/models/GroupMessage';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const message = await GroupMessage.findById(id).populate('userId', 'username avatar');

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { content } = body;

    const updatedMessage = await GroupMessage.findByIdAndUpdate(
      id,
      { $set: { content } },
      { new: true, runValidators: true }
    ).populate('userId', 'username avatar');

    if (!updatedMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedMessage = await GroupMessage.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
