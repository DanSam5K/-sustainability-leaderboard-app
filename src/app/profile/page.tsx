'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileBadges from '@/components/profile/ProfileBadges';
import ProfileActivities from '@/components/profile/ProfileActivities';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader user={user} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileStats user={user} />
          <ProfileBadges user={user} />
        </div>
        <ProfileActivities user={user} />
      </div>
    </main>
  );
} 