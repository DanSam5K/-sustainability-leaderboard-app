import { auth } from './config';

export const checkFirebaseInitialization = async () => {
  try {
    // Try to get the current user, which will fail if Firebase is not properly initialized
    await auth.currentUser;
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}; 