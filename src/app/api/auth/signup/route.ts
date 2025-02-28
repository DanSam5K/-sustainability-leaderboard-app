import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createUser } from '@/lib/firebase/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, name, type, schoolId } = data;

    let userEmail = email;
    if (type === 'school') {
      // Convert school ID to email format
      userEmail = `${schoolId}@school.edu`;
    }

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
    const { user } = userCredential;

    // Create user profile in Firestore
    await createUser({
      uid: user.uid,
      email: userEmail,
      name,
      points: 0,
      badges: [],
      sustainabilityScore: 0,
      createdAt: new Date().toISOString(),
      type,
      ...(type === 'school' && { schoolId }),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        uid: user.uid,
        email: userEmail,
        name,
      }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create user' 
      },
      { status: 400 }
    );
  }
} 