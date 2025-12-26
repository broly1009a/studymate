import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';
import mongoose from 'mongoose';

// PUT - Toggle favorite status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const noteId = id;

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid note ID' },
        { status: 400 }
      );
    }

    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(noteId),
      isDeleted: false,
    });

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note not found' },
        { status: 404 }
      );
    }

    note.isFavorite = !note.isFavorite;
    await note.save();

    return NextResponse.json(
      {
        success: true,
        message: note.isFavorite ? 'Added to favorites' : 'Removed from favorites',
        data: note,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to toggle favorite' },
      { status: 500 }
    );
  }
}
