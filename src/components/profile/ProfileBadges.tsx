'use client';

import { User } from '@/types';
import { Card } from '@/components/ui/card';
import {
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';

interface ProfileBadgesProps {
  user: User;
}

const BADGE_DEFINITIONS = {
  first_challenge: {
    name: 'Challenge Champion',
    description: 'Completed your first sustainability challenge',
    icon: TrophyIcon,
    color: 'text-yellow-500',
  },
  streak_master: {
    name: 'Streak Master',
    description: 'Maintained a 7-day activity streak',
    icon: FireIcon,
    color: 'text-red-500',
  },
  eco_warrior: {
    name: 'Eco Warrior',
    description: 'Completed 5 different types of sustainable actions',
    icon: SparklesIcon,
    color: 'text-purple-500',
  },
  community_leader: {
    name: 'Community Leader',
    description: 'Inspired 3 others to join challenges',
    icon: StarIcon,
    color: 'text-blue-500',
  },
  earth_guardian: {
    name: 'Earth Guardian',
    description: 'Saved over 100kg of CO₂ emissions',
    icon: HeartIcon,
    color: 'text-green-500',
  },
};

export default function ProfileBadges({ user }: ProfileBadgesProps) {
  const earnedBadges = user.badges || [];
  const availableBadges = Object.entries(BADGE_DEFINITIONS);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Badges & Achievements</h2>
        <span className="text-sm text-gray-600">
          {earnedBadges.length} / {availableBadges.length} earned
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableBadges.map(([id, badge]) => {
          const isEarned = earnedBadges.includes(id);
          const Icon = badge.icon;

          return (
            <div
              key={id}
              className={`flex items-center p-3 rounded-lg ${isEarned ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                }`}
            >
              <div
                className={`p-2 rounded-full ${isEarned ? badge.color : 'text-gray-400'
                  } bg-white`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  {badge.name}
                </h3>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
              {isEarned && (
                <div className="ml-auto">
                  <span className="flex items-center text-green-600">
                    <SparklesIcon className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
} 