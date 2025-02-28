'use client';

import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getLeaderboard } from '@/lib/firebase/db';
import { LeaderboardEntry } from '@/types';
import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon';

export default function LeaderboardPage() {
  const { user } = useAuthContext();
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadLeaderboard = async () => {
      if (!user) {
        setLoading(false);
        setError('Please sign in to view the leaderboard');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard(10);
        if (!data || data.length === 0) {
          setError('No leaderboard data available');
          setLeaderboard([]);
        } else {
          setLeaderboard(data);
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setError('Failed to load leaderboard data. Please try again later.');
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-gray-600">Please sign in to view the leaderboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading leaderboard...</p>
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

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-gray-600">No leaderboard data available</p>
      </div>
    );
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-600';
      case 2:
        return 'text-gray-500';
      case 3:
        return 'text-amber-700';
      default:
        return 'text-gray-700';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sustainability Leaderboard
          </h1>
          <p className="text-gray-700 mt-2">
            See how you rank among other eco-warriors
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Points
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Badges
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Impact Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <tr
                key={entry.id}
                className={entry.id === user?.id ? 'bg-green-50' : undefined}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg font-bold ${getRankColor(index + 1)}`}>
                    {getRankEmoji(index + 1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {entry.image && (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={entry.image}
                        alt={entry.name}
                      />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{entry.points}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-1">
                    {Array.isArray(entry.badges) ? entry.badges.map((badge, i) => (
                      <div key={i} title={badge}>
                        <CheckBadgeIcon
                          className="h-5 w-5 text-green-600"
                          aria-label={badge}
                        />
                      </div>
                    )) : null}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {entry.sustainabilityScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 