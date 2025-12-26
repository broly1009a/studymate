import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const profile = await UserProfile.findById(id).populate('userId');

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { fullName, bio, avatar, coverPhoto, phone, location, website, education } = body;

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(fullName && { fullName }),
          ...(bio && { bio }),
          ...(avatar && { avatar }),
          ...(coverPhoto && { coverPhoto }),
          ...(phone && { phone }),
          ...(location && { location }),
          ...(website && { website }),
          ...(education && { education }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedProfile = await UserProfile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
