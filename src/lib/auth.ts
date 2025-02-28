import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub && db) {
        // Get the user's data from Firestore
        const userRef = doc(db, "users", token.sub);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          session.user = {
            ...session.user,
            id: token.sub,
            points: userData.points || 0,
            co2Saved: userData.co2Saved || 0,
            wasteSaved: userData.wasteSaved || 0,
          };
        } else {
          session.user = {
            ...session.user,
            id: token.sub,
            points: 0,
            co2Saved: 0,
            wasteSaved: 0,
          };
        }
      } else if (session?.user && token?.sub) {
        // If db is not available, still set the user ID
        session.user = {
          ...session.user,
          id: token.sub,
          points: 0,
          co2Saved: 0,
          wasteSaved: 0,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
}; 