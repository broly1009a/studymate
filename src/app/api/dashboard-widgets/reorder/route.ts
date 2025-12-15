import { NextRequest, NextResponse } from 'next/server';
import DashboardWidget from '@/models/DashboardWidget';
import connectDB from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, widgets } = body;

    if (!userId || !Array.isArray(widgets)) {
      return NextResponse.json(
        { success: false, message: 'userId and widgets array are required' },
        { status: 400 }
      );
    }

    // Delete old widgets and create new ones
    await DashboardWidget.deleteMany({ userId });

    const createdWidgets = await DashboardWidget.insertMany(
      widgets.map((w: any) => ({
        ...w,
        userId,
      }))
    );

    return NextResponse.json(
      { success: true, data: createdWidgets, message: 'Widgets reordered successfully' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to reorder widgets', error: String(error) },
      { status: 500 }
    );
  }
}
