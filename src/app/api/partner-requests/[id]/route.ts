import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PartnerRequest from '@/models/PartnerRequest';
import Conversation from '@/models/Conversation';
import Notification from '@/models/Notification';
import mongoose from 'mongoose';

// GET - Fetch single partner request
export async function GET(
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
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findById(id)
      .populate('senderId', 'fullName avatar email')
      .populate('receiverId', 'fullName avatar email');

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: partnerRequest,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch partner request',
      },
      { status: 500 }
    );
  }
}

// PUT - Update partner request status (accept/reject)
export async function PUT(
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
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, userId } = body;

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid status. Must be accepted or rejected',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findById(id);

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    // Check if user is the receiver
    if (userId && String(partnerRequest.receiverId) !== String(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are not authorized to update this request',
        },
        { status: 403 }
      );
    }

    if (partnerRequest.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: `Request has already been ${partnerRequest.status}`,
        },
        { status: 400 }
      );
    }

    partnerRequest.status = status;
    await partnerRequest.save();

    let conversation = null;

    // If accepted, create or find conversation
    if (status === 'accepted') {
      try {
        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
          participants: {
            $all: [partnerRequest.senderId, partnerRequest.receiverId],
          },
        });

        if (existingConversation) {
          conversation = existingConversation;
        } else {
          // Create new conversation
          conversation = new Conversation({
            participants: [partnerRequest.senderId, partnerRequest.receiverId],
            participantNames: [partnerRequest.senderName, partnerRequest.receiverName],
            lastMessage: `${partnerRequest.receiverName} đã chấp nhận yêu cầu học cùng`,
            lastMessageTime: new Date(),
            unreadCounts: new Map([
              [String(partnerRequest.senderId), 1],
              [String(partnerRequest.receiverId), 0],
            ]),
            subject: partnerRequest.subject,
            isActive: true,
          });

          await conversation.save();
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
        // Don't fail the request if conversation creation fails
      }
    }

    // Create notification for sender
    try {
      const notification = new Notification({
        userId: partnerRequest.senderId,
        title: status === 'accepted' 
          ? 'Yêu cầu học cùng được chấp nhận' 
          : 'Yêu cầu học cùng bị từ chối',
        message: status === 'accepted'
          ? `${partnerRequest.receiverName} đã chấp nhận yêu cầu học cùng của bạn. Bạn có thể bắt đầu nhắn tin ngay!`
          : `${partnerRequest.receiverName} đã từ chối yêu cầu học cùng của bạn`,
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
        message: `Partner request ${status} successfully`,
        data: {
          request: partnerRequest,
          conversation: conversation,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update partner request',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete partner request (cancel)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request ID',
        },
        { status: 400 }
      );
    }

    const partnerRequest = await PartnerRequest.findById(id);

    if (!partnerRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Partner request not found',
        },
        { status: 404 }
      );
    }

    // Check if user is the sender (only sender can cancel pending requests)
    if (userId && String(partnerRequest.senderId) !== String(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are not authorized to delete this request',
        },
        { status: 403 }
      );
    }

    // Only allow deletion if still pending
    if (partnerRequest.status !== 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete a request that has already been processed',
        },
        { status: 400 }
      );
    }

    await PartnerRequest.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Partner request cancelled successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete partner request',
      },
      { status: 500 }
    );
  }
}
