'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white w-full">
      <div className="flex flex-col md:flex-row justify-between items-center h-16">
        <p className="text-sm text-white pl-4">© 2024 EcoLeader. All rights reserved.</p>
        <div className="flex space-x-6 pr-4">
          <Link href="/privacy" className="text-sm text-white hover:text-gray-200 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-white hover:text-gray-200 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-white hover:text-gray-200 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
} 