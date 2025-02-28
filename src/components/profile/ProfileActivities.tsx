'use client';

import { User } from 'next-auth';
import { Card } from '@/components/ui/card';

interface ProfileActivitiesProps {
  user: User;
}

const PLACEHOLDER_ACTIVITIES = [
  {
    id: '1',
    type: 'recycling',
    description: 'Recycled 2kg of plastic',
    points: 50,
    date: '2024-02-28T10:00:00Z',
  },
  {
    id: '2',
    type: 'transport',
    description: 'Cycled to school',
    points: 30,
    date: '2024-02-28T08:00:00Z',
  },
  {
    id: '3',
    type: 'energy',
    description: 'Used renewable energy',
    points: 20,
    date: '2024-02-27T15:00:00Z',
  },
  {
    id: '4',
    type: 'community',
    description: 'Participated in beach cleanup',
    points: 100,
    date: '2024-02-27T09:00:00Z',
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export default function ProfileActivities({ user }: ProfileActivitiesProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
        <button className="text-sm text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {PLACEHOLDER_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.description}</p>
              <p className="text-sm text-gray-600">
                {formatDate(activity.date)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                +{activity.points} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 