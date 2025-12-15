import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteFolder from '@/models/NoteFolder';
import mongoose from 'mongoose';

// GET - Get notes statistics for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const totalNotes = await Note.countDocuments({
      userId: userObjectId,
      isDeleted: false,
    });

    const pinnedNotes = await Note.countDocuments({
      userId: userObjectId,
      isPinned: true,
      isDeleted: false,
    });

    const favoriteNotes = await Note.countDocuments({
      userId: userObjectId,
      isFavorite: true,
      isDeleted: false,
    });

    const totalFolders = await NoteFolder.countDocuments({
      userId: userObjectId,
      isDeleted: false,
    });

    // Get notes by subject
    const notesBySubject = await Note.aggregate([
      {
        $match: {
          userId: userObjectId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalNotes,
          pinnedNotes,
          favoriteNotes,
          totalFolders,
          notesBySubject,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
