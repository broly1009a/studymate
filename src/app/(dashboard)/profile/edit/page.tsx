'use client';

import { EditProfileForm } from '@/components/profile/edit-profile-form';
import { getUserProfile } from '@/lib/mock-data/profiles';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { vi } from '@/lib/i18n/vi';

export default function EditProfilePage() {
  const profile = getUserProfile('me');

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

