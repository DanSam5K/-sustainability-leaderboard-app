'use client';

import { User } from 'next-auth';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface ProfileBadgesProps {
  user: User;
}

const PLACEHOLDER_BADGES = [
  {
    id: '1',
    name: 'Early Adopter',
    image: '/badges/early-adopter.svg',
    description: 'Joined the sustainability movement early',
  },
  {
    id: '2',
    name: 'Waste Warrior',
    image: '/badges/waste-warrior.svg',
    description: 'Reduced waste by 50kg',
  },
  {
    id: '3',
    name: 'CO₂ Champion',
    image: '/badges/co2-champion.svg',
    description: 'Saved 100kg of CO₂ emissions',
  },
  {
    id: '4',
    name: 'Community Leader',
    image: '/badges/community-leader.svg',
    description: 'Helped others in their sustainability journey',
  },
];

export default function ProfileBadges({ user }: ProfileBadgesProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Badges & Achievements</h2>
      <div className="grid grid-cols-2 gap-4">
        {PLACEHOLDER_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 relative mb-2">
              <Image
                src={badge.image}
                alt={badge.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-900 text-center">{badge.name}</h3>
            <p className="text-xs text-gray-600 text-center mt-1">
              {badge.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
} 