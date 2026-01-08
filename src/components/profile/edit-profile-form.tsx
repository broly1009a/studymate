'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { UserProfile } from '@/types/profile';
import { AvatarUpload } from './avatar-upload';
import { SkillsManager } from './skills-manager';
import { PreferencesManager } from './preferences-manager';
import { ProfileImagesManager } from './profile-images-manager';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  institution: z.string().min(2, 'Institution is required'),
  level: z.enum(['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other']),
  major: z.string().optional(),
  graduationYear: z.number().min(1900).max(2100).optional(),
  mbtiType: z.string().optional(),
  gpa: z.string().optional(),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileFormProps {
  profile: UserProfile;
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [coverPhoto, setCoverPhoto] = useState(profile.coverPhoto);
  const [profileImages, setProfileImages] = useState(profile.profileImages || []);
  const [skills, setSkills] = useState(profile.skills);
  const [preferences, setPreferences] = useState({
    learningNeeds: profile.learningNeeds || [],
    learningGoals: profile.learningGoals || [],
    studyHabits: profile.studyHabits || [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      bio: profile.bio || '',
      dateOfBirth: profile.dateOfBirth 
        ? new Date(profile.dateOfBirth).toISOString().split('T')[0] 
        : '',
      gender: profile.gender,
      institution: profile.education.institution,
      level: profile.education.level,
      major: profile.education.major || '',
      graduationYear: profile.education.graduationYear,
      mbtiType: profile.mbtiType || '',
      gpa: profile.gpa || '',
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const { updateUserProfile } = await import('@/lib/api/profile-client');
      const updateData = {
        ...data,
        avatar,
        coverPhoto,
        profileImages,
        skills,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        education: {
          level: data.level,
          institution: data.institution,
          major: data.major || '',
          graduationYear: data.graduationYear,
        },
        learningNeeds: preferences.learningNeeds,
        learningGoals: preferences.learningGoals,
        studyHabits: preferences.studyHabits,
        mbtiType: data.mbtiType,
        gpa: data.gpa,
        socialLinks: {
          github: data.github || '',
          linkedin: data.linkedin || '',
          twitter: data.twitter || '',
          website: data.website || '',
        },
      };

      const response = await updateUserProfile(token, updateData);
      
      toast.success('Profile updated successfully!');
      router.push('/profile');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar and Cover */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photos</CardTitle>
          <CardDescription>Update your avatar and cover photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Avatar</Label>
            <AvatarUpload
              currentAvatar={avatar}
              onAvatarChange={setAvatar}
              userName={profile.fullName}
            />
          </div>
          
          <div>
            <Label>Cover Photo</Label>
            <div className="mt-2">
              <Input
                type="url"
                placeholder="Cover photo URL"
                value={coverPhoto || ''}
                onChange={(e) => setCoverPhoto(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Images */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Images</CardTitle>
          <CardDescription>Manage your 6 profile images</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileImagesManager
            images={profileImages}
            onImagesChange={setProfileImages}
          />
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              defaultValue={profile.gender}
              onValueChange={(value) => setValue('gender', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us about yourself..."
              rows={4}
            />
            {errors.bio && (
              <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Update your educational background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              {...register('institution')}
              placeholder="University name"
            />
            {errors.institution && (
              <p className="text-sm text-destructive mt-1">{errors.institution.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="level">Education Level *</Label>
            <Select
              defaultValue={profile.education.level}
              onValueChange={(value) => setValue('level', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_school">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              {...register('major')}
              placeholder="Computer Science"
            />
          </div>

          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              {...register('graduationYear', { valueAsNumber: true })}
              placeholder="2025"
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Expertise</CardTitle>
          <CardDescription>Manage your skills and expertise areas</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsManager skills={skills} onSkillsChange={setSkills} />
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Preferences</CardTitle>
          <CardDescription>Update your learning needs, goals, and study habits</CardDescription>
        </CardHeader>
        <CardContent>
          <PreferencesManager
            learningNeeds={preferences.learningNeeds}
            learningGoals={preferences.learningGoals}
            studyHabits={preferences.studyHabits}
            onUpdate={setPreferences}
          />
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Qualifications</CardTitle>
          <CardDescription>Update your academic achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mbtiType">MBTI Type</Label>
            <Input
              id="mbtiType"
              {...register('mbtiType')}
              placeholder="e.g., INTJ, ENFP"
              maxLength={4}
            />
          </div>

          <div>
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              {...register('gpa')}
              placeholder="e.g., 3.5-4.0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Add your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              {...register('github')}
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              {...register('linkedin')}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              {...register('twitter')}
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register('website')}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/profile')}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

