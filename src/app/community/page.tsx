'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/auth/AuthProvider';
import ChatWindow from '@/components/chat/ChatWindow';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CommunityPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[600px]">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h1>
          <p className="text-gray-600 mb-4">
            Please sign in to participate in community discussions and connect with other sustainability enthusiasts.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Community Discussion
        </h1>
        <p className="text-gray-600 mb-8">
          Connect with other sustainability enthusiasts, share your experiences, and discuss environmental challenges.
        </p>
        <ChatWindow />
      </div>
    </div>
  );
} 