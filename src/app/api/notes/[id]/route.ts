import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';
import NoteFolder from '@/models/NoteFolder';
import mongoose from 'mongoose';

// GET - Fetch single note
export async function GET(
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
    }).populate('folderId', 'name color');

    if (!note) {
      return NextResponse.json(
        { success: false, message: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: note,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// PUT - Update note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const noteId = id;
    const body = await request.json();
    const { title, content, subject, tags, folderId } = body;

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

    // Handle folder change
    if (folderId !== undefined) {
      const oldFolderId = note.folderId;

      if (folderId === null || folderId === 'null') {
        note.folderId = null;
      } else if (mongoose.Types.ObjectId.isValid(folderId)) {
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
        note.folderId = new mongoose.Types.ObjectId(folderId);
      }

      // Update folder counts
      if (oldFolderId && oldFolderId.toString() !== (folderId || 'null').toString()) {
        await NoteFolder.findByIdAndUpdate(
          oldFolderId,
          { $inc: { noteCount: -1 } }
        );
        if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
          await NoteFolder.findByIdAndUpdate(
            new mongoose.Types.ObjectId(folderId),
            { $inc: { noteCount: 1 } }
          );
        }
      }
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (subject) note.subject = subject;
    if (tags) note.tags = tags;

    await note.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Note updated successfully',
        data: note,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE - Delete note (soft delete)
export async function DELETE(
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

    // Soft delete
    note.isDeleted = true;
    await note.save();

    // Decrement folder noteCount
    if (note.folderId) {
      await NoteFolder.findByIdAndUpdate(
        note.folderId,
        { $inc: { noteCount: -1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Note deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete note' },
      { status: 500 }
    );
  }
}
