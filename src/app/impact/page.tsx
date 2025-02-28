'use client';

import React from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import ImpactChart from '@/components/charts/ImpactChart';
import { getUserImpactMetrics } from '@/lib/firebase/db';
import { ImpactMetric } from '@/types';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import TruckIcon from '@heroicons/react/24/outline/TruckIcon';

const categories = [
  { name: 'water', icon: BeakerIcon, color: 'blue' },
  { name: 'energy', icon: LightBulbIcon, color: 'yellow' },
  { name: 'waste', icon: TrashIcon, color: 'red' },
  { name: 'transport', icon: TruckIcon, color: 'green' },
];

export default function ImpactPage() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = React.useState<ImpactMetric[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadMetrics = async () => {
      if (!user) {
        setLoading(false);
        setError('Please sign in to view your impact metrics');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userMetrics = await getUserImpactMetrics(user.id);
        setMetrics(userMetrics);
      } catch (error) {
        console.error('Error loading metrics:', error);
        setError('Failed to load impact metrics. Please try again later.');
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <p className="text-lg text-gray-700">Please sign in to view your impact metrics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-700">Loading impact metrics...</p>
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

  const calculateTotalImpact = (category: string) => {
    return metrics
      .filter((metric) => metric.category === category)
      .reduce((total, metric) => total + metric.value, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your Environmental Impact
          </h1>
          <p className="text-gray-700 mt-2">
            Track your sustainability progress
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const total = calculateTotalImpact(category.name);
          return (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon className={`h-8 w-8 text-${category.color}-600`} />
                  <h3 className="ml-3 text-lg font-medium text-gray-900 capitalize">
                    {category.name}
                  </h3>
                </div>
                <span className="text-2xl font-bold text-gray-900">{total}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <ImpactChart metrics={metrics} />
      </div>
    </div>
  );
} 