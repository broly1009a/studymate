import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Subject from '@/models/Subject';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const subject = await Subject.findById(id);

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { name, color, icon, goalHours, topics, progress } = body;

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(name && { name }),
          ...(color && { color }),
          ...(icon && { icon }),
          ...(goalHours !== undefined && { goalHours }),
          ...(topics && { topics }),
          ...(progress !== undefined && { progress }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSubject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subject deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
