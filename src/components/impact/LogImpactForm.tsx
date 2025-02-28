'use client';

import { useState } from 'react';
import { addImpactMetric } from '@/lib/firebase/db';
import { useAuthContext } from '@/components/auth/AuthProvider';
import BeakerIcon from '@heroicons/react/24/outline/BeakerIcon';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import TruckIcon from '@heroicons/react/24/outline/TruckIcon';

const categories = [
  { name: 'water', icon: BeakerIcon, color: 'blue', label: 'Water Saved (L)', unit: 'L' },
  { name: 'energy', icon: LightBulbIcon, color: 'yellow', label: 'Energy Saved (kWh)', unit: 'kWh' },
  { name: 'waste', icon: TrashIcon, color: 'red', label: 'Waste Reduced (kg)', unit: 'kg' },
  { name: 'transport', icon: TruckIcon, color: 'green', label: 'CO₂ Avoided (kg)', unit: 'kg' },
];

interface LogImpactFormProps {
  onMetricAdded: () => void;
}

export default function LogImpactForm({ onMetricAdded }: LogImpactFormProps) {
  const { user } = useAuthContext();
  const [category, setCategory] = useState('water');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to log impact metrics');
      return;
    }

    if (!value || parseFloat(value) <= 0) {
      setError('Please enter a valid positive value');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await addImpactMetric({
        userId: user.id,
        category,
        value: parseFloat(value),
        description: description || `Logged ${value} ${getSelectedCategory().unit} of ${category}`,
      });

      // Update user's CO2 and waste metrics
      if (category === 'waste') {
        // Update user's waste saved metric
        // This would be handled by a cloud function or server-side code
      } else if (category === 'transport') {
        // Update user's CO2 saved metric
        // This would be handled by a cloud function or server-side code
      }

      setValue('');
      setDescription('');
      setSuccess(true);
      onMetricAdded();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error logging impact:', error);
      setError('Failed to log impact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(c => c.name === category) || categories[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Log Your Impact</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
          Impact logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${category === cat.name
                      ? `border-${cat.color}-500 bg-${cat.color}-50`
                      : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <Icon className={`h-6 w-6 text-${cat.color}-500`} />
                  <span className="mt-1 text-xs font-medium capitalize">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            {getSelectedCategory().label}
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="block w-full pr-12 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
              placeholder="0.0"
              step="0.1"
              min="0"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{getSelectedCategory().unit}</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
            placeholder="Describe your sustainable action..."
            rows={2}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Logging...' : 'Log Impact'}
          </button>
        </div>
      </form>
    </div>
  );
} 