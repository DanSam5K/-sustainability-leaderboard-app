'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { auth, storage, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { Loader2, CheckCircle } from 'lucide-react';

interface EditProfileModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const { update: updateSession } = useSession();
  const [name, setName] = useState(user.name ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setName(user.name ?? '');
    setImageFile(null);
    setPreviewUrl(user.image ?? null);
    setError(null);
    setSaveSuccess(false);
  }, [user.name, user.image]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setError('Please sign in again');
        setIsLoading(false);
        return;
      }

      let photoURL = user.image || '';

      // Handle image upload if there's a new image
      if (imageFile) {
        try {
          // Create storage reference with timestamp to avoid caching
          const timestamp = Date.now();
          const storageRef = ref(storage, `profile-pictures/${firebaseUser.uid}_${timestamp}`);

          // Upload the file with metadata
          const metadata = {
            contentType: imageFile.type,
            customMetadata: {
              'uploadedBy': firebaseUser.uid,
              'uploadedAt': new Date().toISOString()
            }
          };

          // Upload file with metadata
          await uploadBytes(storageRef, imageFile, metadata);

          // Get the download URL and wait for it
          photoURL = await getDownloadURL(storageRef);

          if (!photoURL) {
            throw new Error('Failed to get download URL');
          }

          console.log('Image uploaded successfully:', photoURL);
        } catch (uploadError: any) {
          console.error('Error uploading image:', uploadError);
          setError('Failed to upload image. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      // Update Firebase Auth profile
      try {
        await updateProfile(firebaseUser, {
          displayName: name,
          photoURL: photoURL,
        });
      } catch (profileError: any) {
        console.error('Error updating Firebase profile:', profileError);
        setError('Failed to update profile. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update Firestore document
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          name: name,
          image: photoURL,
          updatedAt: new Date(),
        });
      } catch (firestoreError: any) {
        console.error('Error updating Firestore:', firestoreError);
        // Continue even if Firestore update fails
      }

      // Update NextAuth session
      try {
        await updateSession({
          user: {
            name: name,
            image: photoURL,
          }
        });
      } catch (sessionError: any) {
        console.error('Error updating session:', sessionError);
        // Continue even if session update fails
      }

      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error in save process:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 min-h-screen">
      <Card className="w-full max-w-md p-6 bg-white shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Profile updated successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-2 group">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-400" />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                disabled={isLoading}
              >
                <FaCamera className="w-6 h-6 text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-700 font-medium mt-1">Click to change profile picture</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1">
              Display Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || saveSuccess}
              className={`${saveSuccess
                ? 'bg-green-500 hover:bg-green-500'
                : 'bg-green-600 hover:bg-green-700'
                } text-white font-medium px-4 py-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 