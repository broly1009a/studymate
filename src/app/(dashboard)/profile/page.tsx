'use client';

import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileStats } from '@/components/profile/profile-stats';
import { ProfileSkills } from '@/components/profile/profile-skills';
import { ProfileEducation } from '@/components/profile/profile-education';
import { ProfileBadges } from '@/components/profile/profile-badges';
import { ProfileActivities } from '@/components/profile/profile-activities';
import { getUserProfile, getUserActivities } from '@/lib/mock-data/profiles';
import { useAuth } from '@/hooks/use-auth';
import { ProfileAchievements } from './profile-achievements'; // ✅ import đúng chỗ


export default function ProfilePage() {
  const { user } = useAuth();
  const profile = getUserProfile('me');
  const activities = getUserActivities('me');

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

            {/* 👇 Thêm ProfileAchievements vào giữa Education và Skills */}
            <ProfileAchievements />

            <ProfileSkills skills={profile.skills} />
          </div>
        </div>
      </div>
    </div>
  );
}
