'use client';

import { useAuth } from '@/hooks/useAuth';

export function AuthStateSync() {
  // Just using the hook is enough, as it handles the sync internally
  useAuth();

  // This component doesn't render anything
  return null;
} 