'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { getUserImpactMetrics, getUser } from '@/lib/firebase/db';
import { Loader2, Target, Award, Lightbulb, AlertTriangle } from 'lucide-react';

export default function GoalRecommendations() {
  const { user } = useAuthContext();
  const [recommendations, setRecommendations] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyIssue, setApiKeyIssue] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setApiKeyIssue(false);

        // Get user data and metrics
        const [userMetrics, userData] = await Promise.all([
          getUserImpactMetrics(user.id),
          getUser(user.id),
        ]);

        // Call the recommendations API
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userData,
            metrics: userMetrics,
          }),
        });

        const data = await response.json();

        // Check for API key issues
        if (data.apiKeyMissing || data.apiKeyInvalid || data.apiKeyIssue) {
          setApiKeyIssue(true);
          setError(data.message || data.error || 'OpenAI API key configuration issue');
          // Still set recommendations to use the fallback data
          setRecommendations(data.recommendations || '');
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          setRecommendations(data.recommendations || '');
        }
      } catch (error: any) {
        console.error('Error fetching recommendations:', error);

        // Ensure proper error handling for different error types
        let errorMessage = 'Failed to load personalized recommendations';

        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        } else if (error && typeof error === 'object') {
          // Handle object errors by converting to string
          try {
            errorMessage = JSON.stringify(error);
          } catch (e) {
            errorMessage = 'An unidentifiable error occurred';
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  // Parse the recommendations text into structured goals
  const parseGoals = (text: string) => {
    if (!text) return [];

    // Split by numbered goals or bullet points
    const goalBlocks = text.split(/\n\s*(?:\d+\.\s*|\-\s*Goal:)/);

    // Filter out empty blocks and process each goal
    return goalBlocks
      .filter(block => block.trim().length > 0)
      .map(block => {
        // Extract goal components
        const goalMatch = block.match(/(?:Goal:)?\s*([^\n]+)/);
        const targetMatch = block.match(/Target:\s*([^\n]+)/);
        const impactMatch = block.match(/Impact:\s*([^\n]+)/);
        const pointsMatch = block.match(/Points:\s*([^\n]+)/);

        return {
          goal: goalMatch ? goalMatch[1].trim() : 'Personalized Goal',
          target: targetMatch ? targetMatch[1].trim() : '',
          impact: impactMatch ? impactMatch[1].trim() : '',
          points: pointsMatch ? pointsMatch[1].trim() : '',
        };
      });
  };

  const goals = parseGoals(recommendations);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-2" />
          <p className="text-gray-600">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personalized Goals</h2>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          <p>Sign in to get personalized sustainability goals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-green-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Your Personalized Goals</h2>
      </div>

      {apiKeyIssue && (
        <div className="mb-4 bg-yellow-50 text-yellow-700 p-4 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">OpenAI API Key Issue</p>
              <p className="text-sm mt-1">{error}</p>
              <p className="text-sm mt-1">
                Using fallback recommendations. To get personalized AI-generated goals,
                please add a valid OpenAI API key to your .env.local file.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && !apiKeyIssue && (
        <div className="mb-4 bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
          <p className="mt-2 text-sm">Please try again later.</p>
        </div>
      )}

      {goals.length === 0 ? (
        <p className="text-gray-600">No personalized goals available yet. Start logging your sustainability actions to get recommendations!</p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <div key={index} className="border border-green-100 rounded-lg p-4 bg-green-50">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  {index === 0 ? (
                    <Award className="h-5 w-5 text-green-600" />
                  ) : (
                    <Lightbulb className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{goal.goal}</h3>
                  {goal.target && (
                    <p className="text-gray-700 mt-1">
                      <span className="font-semibold">Target:</span> {goal.target}
                    </p>
                  )}
                  {goal.impact && (
                    <p className="text-gray-700 mt-1">
                      <span className="font-semibold">Impact:</span> {goal.impact}
                    </p>
                  )}
                  {goal.points && (
                    <p className="text-green-600 font-semibold mt-2">
                      Earn {goal.points}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 