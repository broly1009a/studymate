'use client';

import { useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileSkills } from '@/components/profile/profile-skills';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfileBadges } from '@/components/profile/profile-badges';
import { ProfileActivities } from '@/components/profile/profile-activities';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, getUserActivities } from '@/lib/api/profile-client';
import { ProfileAchievements } from './profile-achievements';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/types/profile';

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) return;

        const token = localStorage.getItem('auth-token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        // Fetch profile and activities
        const [profileRes, activitiesRes] = await Promise.all([
          getUserProfile(token),
          getUserActivities(token, { page: 1, limit: 10 }),
        ]);

        setProfile(profileRes.profile);
        setActivities(activitiesRes.activities);
        setError(null);
      } catch (err) {
        setError((err as Error).message || 'Failed to load profile');
        console.error('Profile error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfileData();
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{error || 'Failed to load profile'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} isOwnProfile={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileStats statistics={profile.statistics} />
            <ProfileBadges badges={profile.badges} />
            <ProfileActivities activities={activities} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProfileEducation education={profile.education} />
            <ProfileAchievements />
            <ProfileSkills skills={profile.skills} />
          </div>
        </div>
      </div>
    </div>
  );
}
