'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getUserImpactMetrics, getUserChallenges, getUser } from '@/lib/firebase/db';
import Link from 'next/link';
import GoalRecommendations from '@/components/recommendations/GoalRecommendations';

export default function Home() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [userMetrics, userChallenges, userDetails] = await Promise.all([
          getUserImpactMetrics(user.id),
          getUserChallenges(user.id),
          getUser(user.id)
        ]);

        setMetrics(userMetrics);
        setChallenges(userChallenges.filter(c => c.status === 'active'));
        setUserData(userDetails);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Calculate total CO2 saved from transport metrics
  const totalCO2Saved = metrics
    .filter(metric => metric.category === 'transport')
    .reduce((total, metric) => total + metric.value, 0);

  // Get recent activities from metrics, sorted by date
  const recentActivities = [...metrics]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EcoLeader</h1>
        <p className="text-gray-600">Track your sustainability impact and compete with your peers!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Impact</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? "Loading..." : `${totalCO2Saved.toFixed(1)} kg`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? "Loading..." : userData?.points || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Challenges</h2>
          {loading ? (
            <p className="text-gray-500">Loading challenges...</p>
          ) : !user ? (
            <p className="text-gray-500">Sign in to view your challenges</p>
          ) : challenges.length === 0 ? (
            <p className="text-gray-500">No active challenges</p>
          ) : (
            <ul className="space-y-3">
              {challenges.map((challenge) => (
                <li key={challenge.id} className="flex items-center">
                  <div className={`w-2 h-2 bg-${challenge.category === 'transport' ? 'green' : challenge.category === 'waste' ? 'red' : challenge.category === 'energy' ? 'yellow' : 'blue'}-500 rounded-full mr-2`}></div>
                  <Link href={`/challenges/${challenge.id}`} className="text-gray-700 hover:text-primary">
                    {challenge.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          {loading ? (
            <p className="text-gray-500">Loading activities...</p>
          ) : !user ? (
            <p className="text-gray-500">Sign in to view your activities</p>
          ) : recentActivities.length === 0 ? (
            <p className="text-gray-500">No recent activities</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {activity.description || `${activity.value} ${activity.category === 'water' ? 'L water saved' :
                      activity.category === 'energy' ? 'kWh energy saved' :
                        activity.category === 'waste' ? 'kg waste reduced' :
                          'kg CO₂ avoided'}`}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    +{Math.round(activity.value * 2)} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI-Generated Goal Recommendations */}
      <div className="mt-6">
        <GoalRecommendations />
      </div>
    </div>
  );
}
