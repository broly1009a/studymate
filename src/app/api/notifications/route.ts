import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const isRead = searchParams.get('isRead');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const query: any = { userId };
    if (isRead !== null) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications', error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, type, title, description, relatedId, relatedType, link } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const notification = new Notification({
      userId,
      type,
      title,
      description,
      relatedId,
      relatedType,
      link,
    });

    await notification.save();

    return NextResponse.json(
      { success: true, data: notification, message: 'Notification created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create notification', error: String(error) },
      { status: 500 }
    );
  }
}
