'use client';

import { useState } from 'react';
import { Challenge } from '@/types';
import { updateChallengeProgress, completeChallenge } from '@/lib/firebase/db';
import { CheckCircle, XCircle } from 'lucide-react';

interface ChallengeProgressProps {
  challenge: Challenge;
  userId: string;
  onProgressUpdate: () => void;
}

export default function ChallengeProgress({
  challenge,
  userId,
  onProgressUpdate,
}: ChallengeProgressProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProgressUpdate = async (completed: boolean) => {
    setLoading(true);
    setError('');

    try {
      if (completed) {
        await completeChallenge(challenge.id, userId);
      } else {
        const currentProgress = challenge.metrics?.completionRate || 0;
        const newProgress = Math.min(currentProgress + 20, 100); // Increment by 20% each time
        await updateChallengeProgress(challenge.id, userId, newProgress);
      }
      onProgressUpdate();
    } catch (error) {
      setError('Failed to update progress. Please try again.');
      console.error('Error updating challenge progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = challenge.metrics?.completionRate === 100;

  return (
    <div className="mt-4 space-y-4">
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

      {error && (
        <p className="text-sm text-red-600 mb-2">{error}</p>
      )}

      <div className="flex justify-between gap-2">
        <button
          onClick={() => handleProgressUpdate(false)}
          disabled={loading || isCompleted}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Log Progress'}
        </button>
        <button
          onClick={() => handleProgressUpdate(true)}
          disabled={loading || isCompleted}
          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Completing...' : 'Complete Challenge'}
        </button>
      </div>

      {isCompleted && (
        <div className="flex items-center justify-center text-green-600 mt-2">
          <CheckCircle className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Challenge Completed!</span>
        </div>
      )}
    </div>
  );
} 