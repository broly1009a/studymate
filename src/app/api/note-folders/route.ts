import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import NoteFolder from '@/models/NoteFolder';
import mongoose from 'mongoose';

// GET - Fetch all folders for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId is required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const folders = await NoteFolder.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await NoteFolder.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: folders,
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
      { success: false, message: error.message || 'Failed to fetch folders' },
      { status: 500 }
    );
  }
}

// POST - Create new folder
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, name, color, description } = body;

    if (!userId || !name) {
      return NextResponse.json(
        { success: false, message: 'userId and name are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const newFolder = new NoteFolder({
      userId: new mongoose.Types.ObjectId(userId),
      name,
      color: color || 'blue',
      description: description || null,
    });

    await newFolder.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Folder created successfully',
        data: newFolder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create folder' },
      { status: 500 }
    );
  }
}
