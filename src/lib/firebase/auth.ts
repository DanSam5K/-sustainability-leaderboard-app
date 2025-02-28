import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './config';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Mock user for development
const mockUser = {
  uid: 'mock-user-id',
  email: 'user@example.com',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true,
};

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    if (isDevelopment && !auth) {
      console.log('Development mode: Mock sign up', { email, displayName });
      return { user: mockUser };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    if (isDevelopment && !auth) {
      console.log('Development mode: Mock sign in', { email });
      return { user: mockUser };
    }

    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    if (isDevelopment && !auth) {
      console.log('Development mode: Mock sign out');
      return;
    }

    return await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    if (isDevelopment && !auth) {
      console.log('Development mode: Mock password reset', { email });
      return;
    }

    return await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  if (isDevelopment && !auth) {
    console.log('Development mode: Mock auth state change');
    // Simulate an authenticated user in development
    setTimeout(() => callback(mockUser as any), 100);
    return () => {}; // Return empty unsubscribe function
  }

  return onAuthStateChanged(auth, callback);
}; 