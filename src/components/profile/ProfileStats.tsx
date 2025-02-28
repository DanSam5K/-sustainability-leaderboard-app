'use client';

import { User } from 'next-auth';
import { Card } from '@/components/ui/card';
import {
  Leaf,
  Trash2,
  Trophy,
  Flame
} from 'lucide-react';

interface ProfileStatsProps {
  user: User & {
    points?: number;
    co2Saved?: number;
    wasteSaved?: number;
  };
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}

function StatItem({ icon, label, value, unit }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900">
          {value}
          {unit && <span className="ml-1 text-sm font-medium text-gray-700">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sustainability Impact</h2>
      <div className="divide-y">
        <StatItem
          icon={<Trophy className="w-5 h-5 text-primary" />}
          label="Total Points"
          value={user.points || 0}
          unit="pts"
        />
        <StatItem
          icon={<Leaf className="w-5 h-5 text-green-600" />}
          label="CO₂ Saved"
          value={user.co2Saved?.toFixed(1) || '0.0'}
          unit="kg"
        />
        <StatItem
          icon={<Trash2 className="w-5 h-5 text-blue-600" />}
          label="Waste Reduced"
          value={user.wasteSaved?.toFixed(1) || '0.0'}
          unit="kg"
        />
        <StatItem
          icon={<Flame className="w-5 h-5 text-orange-600" />}
          label="Current Streak"
          value="0"
          unit="days"
        />
      </div>
    </Card>
  );
} 