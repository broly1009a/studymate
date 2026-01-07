import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/api/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

/**
 * POST /api/upload/profile-image
 * Upload profile image to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image, oldPublicId, index } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Delete old image if exists
    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue even if deletion fails
      }
    }

    // Upload new image
    const folder = `studymate/profiles/${decoded.id}`;
    const publicId = `profile_${index || Date.now()}`;

    const result = await uploadImage(image, folder, publicId);

    return NextResponse.json({
      success: true,
      image: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload/profile-image
 * Delete profile image from Cloudinary
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    // Delete image from Cloudinary
    await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
