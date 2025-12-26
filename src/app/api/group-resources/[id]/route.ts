import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupResource from '@/models/GroupResource';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const resource = await GroupResource.findById(id).populate('uploaderId', 'username avatar');

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { name, tags } = body;

    const updatedResource = await GroupResource.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(tags && { tags }),
        },
      },
      { new: true, runValidators: true }
    ).populate('uploaderId', 'username avatar');

    if (!updatedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json(updatedResource);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedResource = await GroupResource.findByIdAndDelete(id);

    if (!deletedResource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
