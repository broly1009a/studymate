import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, username, fullName, bio, avatar, coverPhoto, education } = body;

    if (!userId || !username || !fullName) {
      return NextResponse.json(
        { error: 'userId, username, and fullName are required' },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ userId });
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists for this user' },
        { status: 409 }
      );
    }

    const newProfile = new UserProfile({
      userId,
      username,
      fullName,
      bio: bio || '',
      avatar: avatar || null,
      coverPhoto: coverPhoto || null,
      education: education || {},
    });

    const savedProfile = await newProfile.save();

    return NextResponse.json(savedProfile, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
