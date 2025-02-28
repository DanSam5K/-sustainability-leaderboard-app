'use client';

import Link from 'next/link';

export default function SignInButton() {
  return (
    <Link
      href="/auth/signin"
      className="text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors"
    >
      Sign In
    </Link>
  );
} 