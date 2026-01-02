import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PartnerRequest from '@/models/PartnerRequest';
import Notification from '@/models/Notification';

// GET - Fetch partner requests
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId'); 
    const type = searchParams.get('type'); 
    const status = searchParams.get('status'); 

    const skip = (page - 1) * limit;
    let query: any = {};

    if (userId) {
      if (type === 'sent') {
        query.senderId = userId;
      } else if (type === 'received') {
        query.receiverId = userId;
      } else {
        // Get both sent and received
        query.$or = [{ senderId: userId }, { receiverId: userId }];
      }
    }

    if (status) {
      query.status = status;
    }

    const requests = await PartnerRequest.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('senderId', 'fullName avatar email')
      .populate('receiverId', 'fullName avatar email');

    const total = await PartnerRequest.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: requests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch partner requests',
      },
      { status: 500 }
    );
  }
}

// POST - Create partner request
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      senderId,
      senderName,
      senderAvatar,
      receiverId,
      receiverName,
      receiverAvatar,
      subject,
      message,
    } = body;

    // Validation
    if (!senderId || !receiverId || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot send request to yourself',
        },
        { status: 400 }
      );
    }

    // Check if request already exists
    const existingRequest = await PartnerRequest.findOne({
      senderId,
      receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'You already have a pending request with this user',
        },
        { status: 400 }
      );
    }

    // Create request
    const partnerRequest = new PartnerRequest({
      senderId,
      senderName,
      senderAvatar,
      receiverId,
      receiverName,
      receiverAvatar,
      subject,
      message,
      status: 'pending',
    });

    await partnerRequest.save();

    // Create notification for receiver
    try {
      const notification = new Notification({
        userId: receiverId,
        title: 'Yêu cầu học cùng mới',
        message: `${senderName} muốn học ${subject} cùng bạn`,
        type: 'partner_request',
        relatedId: partnerRequest._id,
        isRead: false,
      });
      
      await notification.save();
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Don't fail the request if notification creation fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Partner request sent successfully',
        data: partnerRequest,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to send partner request',
      },
      { status: 500 }
    );
  }
}
