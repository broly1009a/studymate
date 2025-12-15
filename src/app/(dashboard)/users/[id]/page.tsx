'use client';

import { use } from 'react';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileSkills } from '@/components/profile/profile-skills';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfileBadges } from '@/components/profile/profile-badges';
import { ProfileActivities } from '@/components/profile/profile-activities';
import { getUserProfile, getUserActivities } from '@/lib/mock-data/profiles';
import { useAuth } from '@/hooks/use-auth';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const profile = getUserProfile(id);
  const activities = getUserActivities(id);
  const isOwnProfile = user?.id === id;

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

