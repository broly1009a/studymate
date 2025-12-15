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
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  institution: z.string().min(2, 'Institution is required'),
  level: z.enum(['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other']),
  major: z.string().optional(),
  graduationYear: z.number().min(1900).max(2100).optional(),
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
  const [skills, setSkills] = useState(profile.skills);

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
      institution: profile.education.institution,
      level: profile.education.level,
      major: profile.education.major || '',
      graduationYear: profile.education.graduationYear,
      github: '',
      linkedin: '',
      twitter: '',
      website: '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      console.log('Profile update:', {
        ...data,
        avatar,
        coverPhoto,
        skills,
      });
      
      toast.success('Profile updated successfully!');
      router.push('/profile');
    } catch (error) {
      toast.error('Failed to update profile');
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

