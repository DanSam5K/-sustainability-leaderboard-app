'use client';

import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getActiveChallenges } from '@/lib/firebase/db';
import { Challenge } from '@/types';
import BoltIcon from '@heroicons/react/24/outline/BoltIcon';
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';

export default function ChallengesPage() {
  const { user } = useAuthContext();
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadChallenges = async () => {
      if (!user) {
        setLoading(false);
        setError('Please sign in to view challenges');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getActiveChallenges();
        setChallenges(data);
      } catch (error) {
        console.error('Error loading challenges:', error);
        setError('Failed to load challenges. Please try again later.');
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-gray-600">Please sign in to view challenges</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading challenges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'water':
        return 'text-blue-700 bg-blue-100';
      case 'energy':
        return 'text-yellow-700 bg-yellow-100';
      case 'waste':
        return 'text-red-700 bg-red-100';
      case 'transport':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sustainability Challenges
          </h1>
          <p className="text-gray-700 mt-2">
            Join challenges and make a difference together
          </p>
        </div>
        {user && (
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Create Challenge
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                    challenge.category
                  )}`}
                >
                  {challenge.category.charAt(0).toUpperCase() +
                    challenge.category.slice(1)}
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {challenge.points} pts
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {challenge.title}
              </h3>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <UserGroupIcon className="w-5 h-5 mr-2" />
                  <span>{challenge.participants.length} participants</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>
                    Ends {new Date(challenge.endDate).toLocaleDateString()}
                  </span>
                </div>
                {challenge.metrics && (
                  <div className="flex items-center text-gray-700">
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    <span>{challenge.metrics.completionRate}% completed</span>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium ${challenge.participants.includes(user?.id || '')
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  disabled={challenge.participants.includes(
                    user?.id || ''
                  )}
                >
                  {challenge.participants.includes(user?.id || '')
                    ? 'Joined'
                    : 'Join Challenge'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-12">
          <BoltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Active Challenges</h3>
          <p className="text-gray-500">Check back later for new challenges</p>
        </div>
      )}
    </div>
  );
} 