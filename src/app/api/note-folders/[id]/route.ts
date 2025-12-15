import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import NoteFolder from '@/models/NoteFolder';
import Note from '@/models/Note';
import mongoose from 'mongoose';

// GET - Fetch single folder
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const folderId = params.id;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid folder ID' },
        { status: 400 }
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        data: folder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch folder' },
      { status: 500 }
    );
  }
}

// PUT - Update folder
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const folderId = params.id;
    const body = await request.json();
    const { name, color, description } = body;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid folder ID' },
        { status: 400 }
      );
    }

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

    if (name) folder.name = name;
    if (color) folder.color = color;
    if (description !== undefined) folder.description = description;

    await folder.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Folder updated successfully',
        data: folder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update folder' },
      { status: 500 }
    );
  }
}

// DELETE - Delete folder (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const folderId = params.id;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid folder ID' },
        { status: 400 }
      );
    }

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

    // Soft delete folder
    folder.isDeleted = true;
    await folder.save();

    // Move notes from this folder to no folder
    await Note.updateMany(
      { folderId: new mongoose.Types.ObjectId(folderId) },
      { folderId: null }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Folder deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete folder' },
      { status: 500 }
    );
  }
}
