'use client';

import { useState, useEffect } from 'react';
import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile } from '@/lib/api/profile-client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { vi } from '@/lib/i18n/vi';
import type { UserProfile } from '@/types/profile';

export default function EditProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const { profile: profileData } = await getUserProfile(token);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError((err as Error).message || 'Failed to load profile');
        console.error('Profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/profile"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.profile.backToProfile}
            </Link>
          </div>
          <div className="text-center">
            <p className="text-destructive">{error || 'Failed to load profile'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {vi.profile.backToProfile}
          </Link>
          <h1 className="text-3xl font-bold mt-4">{vi.profile.editProfile}</h1>
          <p className="text-muted-foreground mt-2">
            {vi.profile.updateProfile}
          </p>
        </div>

        <EditProfileForm profile={profile} />
      </div>
    </div>
  );
}

