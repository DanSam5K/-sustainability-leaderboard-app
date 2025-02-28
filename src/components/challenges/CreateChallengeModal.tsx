'use client';

import { useState } from 'react';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { createChallenge } from '@/lib/firebase/db';
import { useAuthContext } from '@/components/auth/AuthProvider';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: () => void;
}

type CategoryType = 'waste' | 'water' | 'energy' | 'transport' | 'other';

export default function CreateChallengeModal({
  isOpen,
  onClose,
  onChallengeCreated,
}: CreateChallengeModalProps) {
  const { user } = useAuthContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState('');
  const [category, setCategory] = useState<CategoryType>('waste');
  const [duration, setDuration] = useState('7'); // Default 7 days
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startDate = new Date().toISOString();
      const endDate = new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000).toISOString();

      await createChallenge({
        title,
        description,
        points: parseInt(points),
        category,
        startDate,
        endDate,
        participants: [],
        createdBy: user?.id || 'anonymous',
        status: 'active',
        type: 'daily',
        metrics: {
          totalParticipants: 0,
          completionRate: 0,
          totalImpact: 0,
        },
      });

      onChallengeCreated();
      onClose();
      resetForm();
    } catch (error) {
      setError('Failed to create challenge. Please try again.');
      console.error('Error creating challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPoints('');
    setCategory('waste');
    setDuration('7');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>

        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Create New Challenge
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                placeholder="Enter challenge title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                placeholder="Describe the challenge"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
                placeholder="Enter points value"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                required
              >
                <option value="waste">Waste</option>
                <option value="energy">Energy</option>
                <option value="water">Water</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (days)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                required
              >
                <option value="1">1 day</option>
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
                <option value="30">1 month</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Challenge'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 