import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteFolder from '@/models/NoteFolder';
import mongoose from 'mongoose';

// GET - Fetch all notes for a user with filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const folderId = searchParams.get('folderId');
    const isPinned = searchParams.get('isPinned');
    const isFavorite = searchParams.get('isFavorite');
    const search = searchParams.get('search');
    const subject = searchParams.get('subject');
    const tag = searchParams.get('tag');

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

    if (folderId) {
      if (folderId === 'null') {
        query.folderId = null;
      } else if (mongoose.Types.ObjectId.isValid(folderId)) {
        query.folderId = new mongoose.Types.ObjectId(folderId);
      }
    }

    if (isPinned === 'true') {
      query.isPinned = true;
    }

    if (isFavorite === 'true') {
      query.isFavorite = true;
    }

    if (subject) {
      query.subject = subject;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const notes = await Note.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ isPinned: -1, updatedAt: -1 })
      .populate('folderId', 'name color');

    const total = await Note.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: notes,
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
      { success: false, message: error.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

// POST - Create new note
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, title, content, subject, tags, folderId } = body;

    if (!userId || !title || !content || !subject) {
      return NextResponse.json(
        { success: false, message: 'userId, title, content, and subject are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Verify folder exists if provided
    if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
      const folder = await NoteFolder.findOne({
        _id: new mongoose.Types.ObjectId(folderId),
        isDeleted: false,
      });
      if (!folder) {
        return NextResponse.json(
          { success: false, message: 'Folder not found' },
          { status: 404 }
        );
      }
    }

    const newNote = new Note({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      content,
      subject,
      tags: tags || [],
      folderId: folderId && mongoose.Types.ObjectId.isValid(folderId) 
        ? new mongoose.Types.ObjectId(folderId) 
        : null,
    });

    await newNote.save();

    // Increment folder noteCount if note has a folder
    if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
      await NoteFolder.findByIdAndUpdate(
        new mongoose.Types.ObjectId(folderId),
        { $inc: { noteCount: 1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Note created successfully',
        data: newNote,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create note' },
      { status: 500 }
    );
  }
}
