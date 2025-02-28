'use client';

import { User } from 'next-auth';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import { FaUserCircle } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  user: User & {
    points?: number;
    image?: string | null;
  };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <TooltipProvider>
      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'Profile picture'}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaUserCircle className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-0 right-0 bg-white text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-900 text-white">
                <p>Edit profile picture</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white">
                  <p>Customize your profile</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                <span className="text-lg font-bold">{user.points || 0}</span>
                <span className="ml-1">points</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <EditProfileModal
        user={user}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </TooltipProvider>
  );
} 