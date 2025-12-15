import { NextRequest, NextResponse } from 'next/server';
import DashboardWidget from '@/models/DashboardWidget';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const widgets = await DashboardWidget.find({ userId }).sort({ position: 1 }).lean();

    return NextResponse.json({ success: true, data: widgets });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch widgets', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, widgetType, title, position, size, isVisible, settings } = body;

    if (!userId || !widgetType || !title || position === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const widget = new DashboardWidget({
      userId,
      widgetType,
      title,
      position,
      size: size || 'medium',
      isVisible: isVisible !== false,
      settings: settings || {},
    });

    await widget.save();

    return NextResponse.json(
      { success: true, data: widget, message: 'Widget created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create widget', error: String(error) },
      { status: 500 }
    );
  }
}
