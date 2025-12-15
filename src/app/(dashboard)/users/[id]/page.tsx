'use client';

import { use, useState, useEffect } from 'react';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileSkills } from '@/components/profile/profile-skills';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfileBadges } from '@/components/profile/profile-badges';
import { ProfileActivities } from '@/components/profile/profile-activities';
import { useAuth } from '@/hooks/use-auth';
import { getUserProfile, getUserActivities } from '@/lib/api/users-client';
import { Loader2 } from 'lucide-react';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile and activities in parallel
        const [profileData, activitiesData] = await Promise.all([
          getUserProfile(id),
          getUserActivities(id),
        ]);

        setProfile(profileData);
        setActivities(activitiesData.data || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500 font-medium">{error || 'Không thể tải thông tin người dùng'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

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
            <ProfileSkills skills={profile.skills} />
          </div>
        </div>
      </div>
    </div>
  );
}

