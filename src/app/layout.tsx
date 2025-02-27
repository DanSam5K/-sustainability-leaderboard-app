import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sustainability Leaderboard",
  description: "Track and improve your sustainability impact",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-green-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="font-bold text-xl">
                    EcoLeader
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <Link href="/" className="hover:bg-green-700 px-3 py-2 rounded">
                    Dashboard
                  </Link>
                  <Link href="/leaderboard" className="hover:bg-green-700 px-3 py-2 rounded">
                    Leaderboard
                  </Link>
                  <Link href="/impact" className="hover:bg-green-700 px-3 py-2 rounded">
                    My Impact
                  </Link>
                  <Link href="/challenges" className="hover:bg-green-700 px-3 py-2 rounded">
                    Challenges
                  </Link>
                  <Link href="/community" className="hover:bg-green-700 px-3 py-2 rounded">
                    Community
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
