import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Badge from '@/models/Badge';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const badge = await Badge.findById(id);

    if (!badge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 });
    }

    return NextResponse.json(badge);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { name, description, icon, locked, progress, earnedAt } = body;

    const updatedBadge = await Badge.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(description && { description }),
          ...(icon && { icon }),
          ...(locked !== undefined && { locked }),
          ...(progress !== undefined && { progress }),
          ...(earnedAt && { earnedAt, locked: false }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedBadge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 });
    }

    return NextResponse.json(updatedBadge);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedBadge = await Badge.findByIdAndDelete(id);

    if (!deletedBadge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Badge deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
