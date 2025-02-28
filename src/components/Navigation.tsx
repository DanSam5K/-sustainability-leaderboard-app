'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthButtons from './auth/AuthButtons';
import MobileMenuButton from './navigation/MobileMenuButton';
import MobileMenu from './navigation/MobileMenu';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Impact', href: '/impact' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'Challenges', href: '/challenges' },
  { name: 'Community', href: '/community' },
  { name: 'Eco Assistant', href: '/eco-assistant' },
  { name: 'Waste Recognition', href: '/waste-recognition' },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-800 z-50">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Eco Leaders
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${isActive
                        ? 'bg-green-900 text-white'
                        : 'text-gray-300 hover:bg-green-700 hover:text-white'
                        } px-3 py-2 rounded-md text-sm font-medium`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <AuthButtons />
            </div>
          </div>
          <div className="flex md:hidden">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navigation={[
          ...navigation,
          ...(session?.user ? [{ name: 'Profile', href: '/profile' }] : []),
        ]}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
} 