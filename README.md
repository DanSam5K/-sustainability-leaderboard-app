# Sustainability Leaderboard App

A Next.js application for tracking sustainability efforts, participating in eco-challenges, and learning about environmental impact through an interactive leaderboard and AI-powered features.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Setting Up External Services](#setting-up-external-services)
  - [Firebase Setup](#firebase-setup)
  - [Google OAuth Setup](#google-oauth-setup)
  - [OpenAI API Setup](#openai-api-setup)
- [Application Structure](#application-structure)
  - [Directory Structure](#directory-structure)
  - [App Flow](#app-flow)
- [Database Schema](#database-schema)
- [AI Features](#ai-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login with Google OAuth via NextAuth.js and Firebase
- **Impact Tracking**: Log and visualize sustainability metrics (water saved, energy saved, waste reduced, CO₂ avoided)
- **Challenges**: Join and complete sustainability challenges to earn points
- **Leaderboard**: Compete with peers and see who's making the biggest impact
- **Community**: Connect with like-minded individuals and share sustainability tips
- **AI-Powered Features**:
  - **EcoBot Assistant**: Get personalized sustainability advice and answers to environmental questions
  - **Goal Recommendations**: Receive AI-generated sustainability goals based on your activity
  - **Waste Recognition**: Upload photos of waste items to get proper disposal instructions

## Tech Stack

- **Frontend**: Next.js 15.2.0, React, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Functions
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js, Firebase Authentication
- **AI Services**: OpenAI GPT-3.5 Turbo and GPT-4 Vision
- **Styling**: Tailwind CSS, Lucide Icons, Heroicons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git
- A Firebase account
- A Google Cloud Platform account (for OAuth)
- An OpenAI account with API access

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sustainability-leaderboard-app.git
   cd sustainability-leaderboard-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory (see [Environment Variables](#environment-variables) section)

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# NextAuth.js configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OpenAI API key (required for EcoBot and Waste Recognition)
OPENAI_API_KEY=your_openai_api_key
```

## Setting Up External Services

### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project
2. Enable the following services:
   - **Authentication**: 
     - Go to Authentication > Sign-in method
     - Enable Google and Email/Password providers
   - **Firestore Database**:
     - Go to Firestore Database > Create database
     - Start in production mode or test mode (you can change this later)
     - Choose a location close to your target users
3. Get your Firebase configuration:
   - Go to Project settings > General
   - Scroll down to "Your apps" and click the web app icon (</>) if you haven't created one
   - Register your app with a nickname
   - Copy the Firebase configuration object (apiKey, authDomain, etc.)
   - Add these values to your `.env.local` file

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your Firebase project
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen if prompted
   - User Type: External
   - Add app name, user support email, and developer contact information
   - Add scopes for email and profile
6. Create OAuth client ID:
   - Application type: Web application
   - Name: Sustainability Leaderboard App
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

### OpenAI API Setup

1. Create an account on [OpenAI's platform](https://platform.openai.com/signup)
2. Navigate to the [API keys section](https://platform.openai.com/api-keys)
3. Create a new API key
4. Copy the API key (it starts with `sk-`)
5. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your_openai_api_key
   ```

**Note:** The Waste Recognition feature uses the GPT-4 Vision model, which requires a paid OpenAI account with access to GPT-4 Vision.

## Application Structure

### Directory Structure

```
sustainability-leaderboard-app/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # NextAuth.js authentication
│   │   │   ├── chat/        # EcoBot API
│   │   │   ├── recommendations/ # Goal recommendations API
│   │   │   └── waste-recognition/ # Waste recognition API
│   │   ├── auth/            # Authentication pages
│   │   ├── challenges/      # Challenge pages
│   │   ├── community/       # Community pages
│   │   ├── eco-assistant/   # EcoBot assistant page
│   │   ├── impact/          # Impact tracking pages
│   │   ├── leaderboard/     # Leaderboard page
│   │   ├── profile/         # User profile page
│   │   ├── waste-recognition/ # Waste recognition page
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── providers.tsx    # Context providers
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── challenges/      # Challenge components
│   │   ├── chat/            # Chat components
│   │   ├── community/       # Community components
│   │   ├── impact/          # Impact tracking components
│   │   ├── layout/          # Layout components
│   │   ├── leaderboard/     # Leaderboard components
│   │   ├── profile/         # Profile components
│   │   ├── recommendations/ # Recommendation components
│   │   └── waste/           # Waste recognition components
│   ├── lib/                 # Utility functions
│   │   ├── firebase/        # Firebase configuration and helpers
│   │   │   ├── config.ts    # Firebase initialization
│   │   │   └── db.ts        # Firestore database functions
│   │   └── auth.ts          # NextAuth.js configuration
│   └── types/               # TypeScript type definitions
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

### App Flow

1. **Authentication Flow**:
   - User visits the app and is prompted to sign in
   - User authenticates with Google or email/password
   - NextAuth.js creates a session and stores user data
   - Firebase Authentication is synchronized with NextAuth.js
   - User data is stored/updated in Firestore

2. **Main User Journey**:
   - **Home Page**: Overview dashboard with impact summary and personalized goals
   - **Impact Tracking**: Log sustainability actions and view metrics
   - **Challenges**: Browse, join, and complete sustainability challenges
   - **Leaderboard**: View rankings based on points earned
   - **Community**: Interact with other users and share experiences
   - **AI Features**: Get personalized assistance and recommendations

3. **AI Features Flow**:
   - **EcoBot**: User asks questions → API calls OpenAI → Response displayed
   - **Goal Recommendations**: User data analyzed → OpenAI generates goals → Goals displayed
   - **Waste Recognition**: User uploads image → OpenAI Vision analyzes → Disposal instructions displayed

## Database Schema

The application uses Firebase Firestore as its database. Here's the schema design:

### Collections and Documents

1. **users**
   - `id`: string (Firebase Auth UID)
   - `name`: string
   - `email`: string
   - `image`: string (profile image URL)
   - `points`: number
   - `createdAt`: timestamp
   - `updatedAt`: timestamp

2. **impactMetrics**
   - `id`: string (auto-generated)
   - `userId`: string (reference to users)
   - `category`: string (water, energy, waste, transport)
   - `value`: number
   - `description`: string
   - `date`: timestamp
   - `points`: number

3. **challenges**
   - `id`: string (auto-generated)
   - `title`: string
   - `description`: string
   - `category`: string
   - `points`: number
   - `startDate`: timestamp
   - `endDate`: timestamp
   - `createdBy`: string (reference to users)
   - `participants`: array of strings (references to users)

4. **userChallenges**
   - `id`: string (auto-generated)
   - `userId`: string (reference to users)
   - `challengeId`: string (reference to challenges)
   - `status`: string (active, completed, abandoned)
   - `joinedAt`: timestamp
   - `completedAt`: timestamp (optional)

5. **messages**
   - `id`: string (auto-generated)
   - `userId`: string (reference to users)
   - `content`: string
   - `createdAt`: timestamp
   - `likes`: array of strings (references to users)

### Relationships

- Users have many ImpactMetrics (one-to-many)
- Users create many Challenges (one-to-many)
- Users participate in many Challenges (many-to-many through userChallenges)
- Users post many Messages (one-to-many)
- Users like many Messages (many-to-many)

## AI Features

### EcoBot Assistant

The EcoBot assistant uses OpenAI's GPT-3.5 Turbo model to provide sustainability advice and answer environmental questions. The system is designed to:

- Provide informative and concise responses
- Offer practical, actionable advice
- Focus on positive impact and encouragement
- Include specific facts about environmental impact
- Suggest small, achievable actions

### Goal Recommendations

The goal recommendation system analyzes user activity data and uses OpenAI to generate personalized sustainability goals. The system:

- Examines user's impact metrics and recent activities
- Identifies areas for improvement
- Generates specific, actionable goals with measurable targets
- Provides context on environmental impact
- Assigns point values to motivate completion

### Waste Recognition

The waste recognition feature uses OpenAI's GPT-4 Vision model to analyze images of waste items and provide disposal instructions. The system:

- Identifies the type of waste item
- Classifies it into a waste category (Recyclable, Compostable, etc.)
- Provides specific disposal instructions
- Suggests sustainable alternatives
- Includes an interesting fact about environmental impact

## Troubleshooting

### Common Issues

1. **OpenAI API Key Issues**:
   - Ensure your API key starts with `sk-`
   - Check that your OpenAI account has sufficient credits
   - For Waste Recognition, ensure you have access to GPT-4 Vision

2. **Firebase Authentication Issues**:
   - Verify that Google authentication is enabled in Firebase
   - Check that your redirect URIs are correctly configured
   - Ensure your Firebase configuration variables are correct

3. **Next.js Build Errors**:
   - Try cleaning the Next.js cache: `npm run clean`
   - Ensure compatibility between Firebase and Next.js versions
   - Check for TypeScript errors in your codebase

### Error Messages

- **"Failed to analyze image"**: Check your OpenAI API key and ensure you have access to GPT-4 Vision
- **"OpenAI API key is not configured"**: Add a valid API key to your `.env.local` file
- **"Firebase is not initialized"**: Check your Firebase configuration in `.env.local`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Heroicons](https://heroicons.com/)
