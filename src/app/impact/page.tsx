'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getUserImpactMetrics } from '@/lib/firebase/db';
import ImpactChart from '@/components/charts/ImpactChart';
import LogImpactForm from '@/components/impact/LogImpactForm';
import CategoryImpactChart from '@/components/impact/CategoryImpactChart';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import TruckIcon from '@heroicons/react/24/outline/TruckIcon';

// Define categories with their properties
const categories = [
  { name: 'water', icon: BeakerIcon, color: 'blue', label: 'Water Saved', unit: 'L' },
  { name: 'energy', icon: LightBulbIcon, color: 'yellow', label: 'Energy Saved', unit: 'kWh' },
  { name: 'waste', icon: TrashIcon, color: 'red', label: 'Waste Reduced', unit: 'kg' },
  { name: 'transport', icon: TruckIcon, color: 'green', label: 'CO₂ Avoided', unit: 'kg' },
];

export default function ImpactPage() {
  const { user } = useAuthContext();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
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

  const handleMetricAdded = async () => {
    if (user) {
      try {
        setLoading(true);
        const userMetrics = await getUserImpactMetrics(user.id);
        setMetrics(userMetrics);
        setShowLogForm(false); // Hide form after successful submission
      } catch (err) {
        console.error('Error refreshing metrics:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const calculateTotalImpact = (category: string) => {
    return metrics
      .filter((metric) => metric.category === category)
      .reduce((total, metric) => total + metric.value, 0);
  };

  // Calculate environmental equivalents
  const calculateEquivalents = (category: string, value: number) => {
    switch (category) {
      case 'water':
        return `${Math.round(value / 10)} minutes of shower time`;
      case 'energy':
        return `${Math.round(value * 100)} hours of LED light`;
      case 'waste':
        return `${Math.round(value * 20)} plastic bottles`;
      case 'transport':
        return `${Math.round(value * 6)} km of driving`;
      default:
        return '';
    }
  };

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
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {showLogForm ? 'Hide Form' : 'Log New Impact'}
        </button>
      </div>

      {showLogForm && (
        <div className="mb-8">
          <LogImpactForm onMetricAdded={handleMetricAdded} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          const total = calculateTotalImpact(category.name);
          const equivalent = calculateEquivalents(category.name, total);
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
              {equivalent && (
                <p className="mt-2 text-sm text-gray-600">
                  Equivalent to {equivalent}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <ImpactChart metrics={metrics} />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Impact by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Icon className={`h-5 w-5 text-${cat.color}-600 mr-2`} />
                  {cat.label}
                </h3>
                <CategoryImpactChart
                  metrics={metrics}
                  category={cat.name}
                  color={cat.color}
                  unit={cat.unit}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 