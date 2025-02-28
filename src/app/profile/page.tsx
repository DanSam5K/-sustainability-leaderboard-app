'use client';

import { useAuthContext } from '@/components/auth/AuthProvider';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileBadges from '@/components/profile/ProfileBadges';
import ProfileActivities from '@/components/profile/ProfileActivities';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { getUserChallenges } from '@/lib/firebase/db';
import { Challenge } from '@/types';
import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useAuthContext();
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadUserChallenges = async () => {
      if (!user) return;

      try {
        const challenges = await getUserChallenges(user.id);
        setUserChallenges(challenges);
      } catch (error) {
        console.error('Error loading user challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserChallenges();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-gray-600">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          {user.image && (
            <img
              src={user.image}
              alt={user.name || ''}
              className="w-20 h-20 rounded-full mr-4"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <PencilIcon className="w-5 h-5 mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileStats user={user} />
          <ProfileBadges user={user} />
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Challenges</h2>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : userChallenges.length > 0 ? (
              <div className="space-y-4">
                {userChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {challenge.title}
                      </h3>
                      <span className="text-sm font-medium text-green-600">
                        {challenge.points} pts
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-green-600">
                              Progress
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-green-600">
                              {challenge.metrics?.completionRate || 0}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                          <div
                            style={{ width: `${challenge.metrics?.completionRate || 0}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Ends {new Date(challenge.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">
                No active challenges. Join some challenges to get started!
              </p>
            )}
          </div>
          <ProfileActivities user={user} />
        </div>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
} 