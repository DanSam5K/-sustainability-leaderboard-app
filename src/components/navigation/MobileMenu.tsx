'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButtons from '../auth/AuthButtons';

interface Props {
  isOpen: boolean;
  navigation: Array<{
    name: string;
    href: string;
  }>;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, navigation, onClose }: Props) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-64 bg-green-800 transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${isActive
                  ? 'bg-green-900 text-white'
                  : 'text-gray-300 hover:bg-green-700 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="pt-4 pb-3 border-t border-green-700">
          <div className="px-2">
            <AuthButtons className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
} 