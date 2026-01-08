import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/api/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';
import Partner from '@/models/Partner';
import Badge from '@/models/Badge';
import StudyStreak from '@/models/StudyStreak';
import Skill from '@/models/Skill';
import mongoose from 'mongoose';

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Create or update Partner profile from User and UserProfile
 */
async function createOrUpdatePartner(
  userId: string,
  user: any,
  userProfile: any
): Promise<void> {
  try {
    // Calculate age from dateOfBirth
    const age = user.dateOfBirth ? calculateAge(user.dateOfBirth) : 18;

    // Get avatar (priority: profileImages[0] > avatar)
    const avatar = user.profileImages?.length > 0 
      ? user.profileImages[0].url 
      : user.avatar || userProfile.avatar;

    // Map subjects from learningNeeds (extract actual subjects)
    const subjects = userProfile.learningNeeds || [];

    // Prepare partner data
    const partnerData = {
      userId: new mongoose.Types.ObjectId(userId),
      name: user.fullName,
      avatar: avatar || '',
      age: age,
      major: userProfile.education?.major || user.major || '',
      university: userProfile.education?.institution || user.school || '',
      bio: userProfile.bio || user.bio || '',
      subjects: subjects,
      studyStyle: userProfile.studyHabits || [],
      goals: userProfile.learningGoals || [],
      timezone: 'GMT+7',
      languages: ['Tiếng Việt'],
      status: 'available', // Set as available when profile is complete
      availability: [], // Can be added later in profile settings
    };

    // Upsert (create or update) Partner profile
    await Partner.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: partnerData },
      { upsert: true, new: true }
    );

    console.log(`✅ Partner profile synced for user: ${userId}`);
  } catch (error) {
    console.error('❌ Error creating/updating partner:', error);
    // Don't throw error to prevent blocking profile update
  }
}

/**
 * Check if profile is complete enough to create partner
 */
function isProfileComplete(user: any, userProfile: any): boolean {
  return !!(
    user.fullName &&
    user.dateOfBirth &&
    userProfile.education?.institution &&
    userProfile.education?.major &&
    userProfile.learningNeeds?.length > 0
  );
}

/**
 * GET /api/profiles/me
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
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

    console.log('Decoded token:', decoded);

    // Connect to database
    await connectDB();

    // Fetch user data
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch or create user profile
    let userProfile = await UserProfile.findOne({ userId: decoded.id });
    if (!userProfile) {
      // Create default profile if not exists
      userProfile = await UserProfile.create({
        userId: decoded.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
        phone: user.phone,
        location: user.location,
        education: {
          institution: user.school,
          major: user.major,
        },
        reputation: user.reputation || 0,
      });
    }

    // Fetch skills
    const skills = await Skill.find({ userId: decoded.id }).lean();

    // Fetch badges
    const badges = await Badge.find({ userId: decoded.id }).lean();

    // Fetch study streak
    const studyStreak = await StudyStreak.findOne({ userId: decoded.id }).lean();

    // Calculate statistics (you may need to query other collections)
    const statistics = {
      totalStudyHours: 0, // TODO: Calculate from StudySession
      studyStreak: studyStreak?.current || 0,
      longestStreak: studyStreak?.longest || 0,
      questionsAnswered: 0, // TODO: Count from Answer model
      questionsAsked: 0, // TODO: Count from Question model
      groupsJoined: 0, // TODO: Count from GroupMember model
      partnersConnected: 0, // TODO: Count from Partner model
      competitionsParticipated: 0, // TODO: Count from Competition participants
      goalsCompleted: 0, // TODO: Count from Goal model where status is completed
    };

    // Build profile response
    const profile = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: userProfile.avatar || user.avatar,
      coverPhoto: userProfile.coverPhoto,
      bio: userProfile.bio || user.bio,
      phone: user.phone,
      location: user.location,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth?.toISOString(),
      profileImages: user.profileImages || [],
      education: {
        level: userProfile.education?.level,
        institution: userProfile.education?.institution,
        major: userProfile.education?.major,
        graduationYear: userProfile.education?.graduationYear,
      },
      learningNeeds: userProfile.learningNeeds || [],
      learningGoals: userProfile.learningGoals || [],
      studyHabits: userProfile.studyHabits || [],
      mbtiType: userProfile.mbtiType,
      gpa: userProfile.gpa,
      certificates: userProfile.certificates || [],
      awards: userProfile.awards || [],
      skills: skills.map(skill => ({
        id: skill._id.toString(),
        name: skill.name,
        category: skill.category,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience,
      })),
      languages: [], // TODO: Add Language model if needed
      statistics,
      badges: badges.map(badge => ({
        id: badge._id.toString(),
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        earnedAt: badge.earnedAt?.toISOString(),
        locked: badge.locked,
      })),
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        website: userProfile.website || '',
      },
      reputation: userProfile.reputation || user.reputation || 0,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profiles/me
 * Update current user's profile
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

    // Connect to database
    await connectDB();

    // Update User model
    const userUpdates: any = {};
    if (body.fullName) userUpdates.fullName = body.fullName;
    if (body.bio) userUpdates.bio = body.bio;
    if (body.avatar) userUpdates.avatar = body.avatar;
    if (body.phone) userUpdates.phone = body.phone;
    if (body.location) userUpdates.location = body.location;
    if (body.gender) userUpdates.gender = body.gender;
    
    // Handle dateOfBirth - convert string to Date if needed
    if (body.dateOfBirth) {
      if (typeof body.dateOfBirth === 'string') {
        userUpdates.dateOfBirth = new Date(body.dateOfBirth);
      } else {
        userUpdates.dateOfBirth = body.dateOfBirth;
      }
    }
    
    if (body.profileImages) userUpdates.profileImages = body.profileImages;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(decoded.id, userUpdates);
    }

    // Update UserProfile model
    const profileUpdates: any = {};
    if (body.coverPhoto) profileUpdates.coverPhoto = body.coverPhoto;
    if (body.bio) profileUpdates.bio = body.bio;
    if (body.avatar) profileUpdates.avatar = body.avatar;
    if (body.website) profileUpdates.website = body.website;
    if (body.education) {
      profileUpdates['education.level'] = body.education.level;
      profileUpdates['education.institution'] = body.education.institution;
      profileUpdates['education.major'] = body.education.major;
      profileUpdates['education.graduationYear'] = body.education.graduationYear;
    }
    
    // Matching data
    if (body.learningNeeds) profileUpdates.learningNeeds = body.learningNeeds;
    if (body.learningGoals) profileUpdates.learningGoals = body.learningGoals;
    if (body.studyHabits) profileUpdates.studyHabits = body.studyHabits;
    if (body.mbtiType !== undefined) profileUpdates.mbtiType = body.mbtiType;
    if (body.gpa !== undefined) profileUpdates.gpa = body.gpa;
    if (body.awards) profileUpdates.awards = body.awards;
    if (body.certificates) profileUpdates.certificates = body.certificates;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: decoded.id },
      { $set: profileUpdates },
      { new: true, upsert: true }
    );

    // Update skills if provided
    if (body.skills && Array.isArray(body.skills)) {
      // Delete old skills and create new ones
      await Skill.deleteMany({ userId: decoded.id });
      
      const skillsToCreate = body.skills.map((skill: any) => ({
        userId: decoded.id,
        name: skill.name,
        category: skill.category || 'other',
        level: skill.level || 'beginner',
        yearsOfExperience: skill.yearsOfExperience || 0,
      }));
      
      if (skillsToCreate.length > 0) {
        await Skill.insertMany(skillsToCreate);
      }
    }

    // Fetch updated profile
    const user = await User.findById(decoded.id).select('-password');
    const skills = await Skill.find({ userId: decoded.id }).lean();
    const badges = await Badge.find({ userId: decoded.id }).lean();
    const studyStreak = await StudyStreak.findOne({ userId: decoded.id }).lean();

    // Auto-sync Partner profile if profile is complete
    if (isProfileComplete(user, userProfile)) {
      await createOrUpdatePartner(decoded.id, user, userProfile);
    }

    const statistics = {
      totalStudyHours: 0,
      studyStreak: studyStreak?.current || 0,
      longestStreak: studyStreak?.longest || 0,
      questionsAnswered: 0,
      questionsAsked: 0,
      groupsJoined: 0,
      partnersConnected: 0,
      competitionsParticipated: 0,
      goalsCompleted: 0,
    };

    const updatedProfile = {
      id: user!._id.toString(),
      username: user!.username,
      email: user!.email,
      fullName: user!.fullName,
      avatar: userProfile.avatar || user!.avatar,
      coverPhoto: userProfile.coverPhoto,
      bio: userProfile.bio || user!.bio,
      phone: user!.phone,
      location: user!.location,
      gender: user!.gender,
      dateOfBirth: user!.dateOfBirth?.toISOString(),
      profileImages: user!.profileImages || [],
      education: {
        level: userProfile.education?.level,
        institution: userProfile.education?.institution,
        major: userProfile.education?.major,
        graduationYear: userProfile.education?.graduationYear,
      },
      learningNeeds: userProfile.learningNeeds || [],
      learningGoals: userProfile.learningGoals || [],
      studyHabits: userProfile.studyHabits || [],
      mbtiType: userProfile.mbtiType,
      gpa: userProfile.gpa,
      certificates: userProfile.certificates || [],
      awards: userProfile.awards || [],
      skills: skills.map(skill => ({
        id: skill._id.toString(),
        name: skill.name,
        category: skill.category,
        level: skill.level,
        yearsOfExperience: skill.yearsOfExperience,
      })),
      languages: [],
      statistics,
      badges: badges.map(badge => ({
        id: badge._id.toString(),
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        earnedAt: badge.earnedAt?.toISOString(),
        locked: badge.locked,
      })),
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        website: userProfile.website || '',
      },
      reputation: userProfile.reputation || user!.reputation || 0,
      createdAt: user!.createdAt.toISOString(),
      updatedAt: user!.updatedAt.toISOString(),
    };

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
