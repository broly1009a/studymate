import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GroupResource from '@/models/GroupResource';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get('groupId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!groupId) {
      return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

    const resources = await GroupResource.find({ groupId })
      .populate('uploaderId', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GroupResource.countDocuments({ groupId });

    return NextResponse.json({
      data: resources,
      total,
      skip,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { groupId, name, type, uploaderId, fileUrl, fileSize, tags, parentId } = body;

    if (!groupId || !name || !type || !uploaderId) {
      return NextResponse.json(
        { error: 'groupId, name, type, and uploaderId are required' },
        { status: 400 }
      );
    }

    const newResource = new GroupResource({
      groupId,
      name,
      type,
      uploaderId,
      fileUrl: fileUrl || null,
      fileSize: fileSize || null,
      tags: tags || [],
      parentId: parentId || null,
    });

    const savedResource = await newResource.save();
    const populatedResource = await savedResource.populate('uploaderId', 'username avatar');

    return NextResponse.json(populatedResource, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
