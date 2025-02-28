'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

interface Props {
  className?: string;
}

export default function SignOutButton({ className = "text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors" }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
    >
      Sign Out
    </button>
  );
} 