import { NextRequest, NextResponse } from 'next/server';
import DashboardWidget from '@/models/DashboardWidget';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid widget ID' },
        { status: 400 }
      );
    }

    const widget = await DashboardWidget.findById(id).lean();

    if (!widget) {
      return NextResponse.json(
        { success: false, message: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: widget });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch widget', error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid widget ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const widget = await DashboardWidget.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!widget) {
      return NextResponse.json(
        { success: false, message: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: widget, message: 'Widget updated successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update widget', error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid widget ID' },
        { status: 400 }
      );
    }

    const widget = await DashboardWidget.findByIdAndDelete(id);

    if (!widget) {
      return NextResponse.json(
        { success: false, message: 'Widget not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: widget, message: 'Widget deleted successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete widget', error: String(error) },
      { status: 500 }
    );
  }
}
