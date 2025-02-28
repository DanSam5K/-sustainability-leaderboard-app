'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '../ui/LoadingSpinner';
import SignInButton from './SignInButton';
import SignOutButton from './SignOutButton';
import { useAuthContext } from './AuthProvider';
import { FaUserCircle } from 'react-icons/fa';

interface Props {
  className?: string;
}

export default function AuthButtons({ className = '' }: Props) {
  const { user, loading } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return (
      <div className={`relative flex ${className.includes('w-full') ? 'flex-col items-start space-y-4' : 'items-center space-x-4'} ${className}`}>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-white">
            {user.name}
          </span>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || ''}
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                />
              ) : (
                <FaUserCircle className="w-8 h-8 text-white cursor-pointer hover:opacity-80 transition-opacity" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {user.email && (
                  <div className="px-4 py-2 text-sm text-gray-700 border-b break-all">
                    {user.email}
                  </div>
                )}
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <div className="border-t">
                  <SignOutButton className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <SignInButton />
    </div>
  );
} 