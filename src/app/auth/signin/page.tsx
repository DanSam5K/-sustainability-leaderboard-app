'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getUser, createUser } from '@/lib/firebase/db';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeForm, setActiveForm] = useState<'email' | 'school'>('email');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      let userData = await getUser(user.uid);

      // If not, create a new user document
      if (!userData) {
        await createUser({
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          image: user.photoURL || '',
          points: 0,
          badges: [],
          sustainabilityScore: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      router.push('/');
    } catch (err) {
      setError('Failed to sign in with Google');
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userData = await getUser(user.uid);
      if (!userData) {
        await createUser({
          id: user.uid,
          name: user.displayName || email.split('@')[0],
          email: user.email || email,
          image: user.photoURL || '',
          points: 0,
          badges: [],
          sustainabilityScore: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Email sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const formData = new FormData(e.currentTarget);
      const schoolId = formData.get('schoolId') as string;
      const password = formData.get('password') as string;

      const userCredential = await signInWithEmailAndPassword(auth, `${schoolId}@school.edu`, password);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userData = await getUser(user.uid);
      if (!userData) {
        setError('School ID not found. Please sign up first.');
        return;
      }

      router.push('/');
    } catch (err) {
      setError('Invalid school ID or password');
      console.error('School ID sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join the sustainability movement
        </p>
      </div>

      {error && (
        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="mr-2"
              />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Toggle buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveForm('email')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${activeForm === 'email'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setActiveForm('school')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${activeForm === 'school'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                School ID
              </button>
            </div>

            {/* Email Form */}
            {activeForm === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in with Email'}
                </button>
              </form>
            )}

            {/* School ID Form */}
            {activeForm === 'school' && (
              <form onSubmit={handleSchoolSubmit} className="space-y-6">
                <div>
                  <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700">
                    School ID
                  </label>
                  <div className="mt-1">
                    <input
                      id="schoolId"
                      name="schoolId"
                      type="text"
                      required
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="schoolPassword" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="schoolPassword"
                      name="password"
                      type="password"
                      required
                      disabled={isLoading}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in with School ID'}
                </button>
              </form>
            )}

            <div className="text-sm text-center">
              <a href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
                Don't have an account? Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 