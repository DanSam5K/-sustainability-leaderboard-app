import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { auth } from "@/lib/firebase/config"
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth"
import { createUser, getUser } from "@/lib/firebase/db"
import { User, Badge } from "@/types"
import { authOptions } from '@/lib/auth'

// Set Firebase persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch(console.error);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials');
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 