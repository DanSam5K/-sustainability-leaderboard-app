# Sustainability Leaderboard App

A Next.js application for tracking sustainability efforts, participating in eco-challenges, and learning about environmental impact.

## Features

- User authentication with NextAuth.js and Firebase
- Sustainability challenges and leaderboard
- AI-powered EcoBot assistant for sustainability tips
- Waste recognition using AI vision
- Impact metrics tracking
- Community discussion

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account
- OpenAI API key

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

3. Create a `.env.local` file in the root directory with the following variables:
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

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Setting Up OpenAI API Key

The EcoBot assistant and Waste Recognition features require an OpenAI API key to function properly. Follow these steps to set up your API key:

1. Create an account on [OpenAI's platform](https://platform.openai.com/signup)
2. Navigate to the [API keys section](https://platform.openai.com/api-keys)
3. Create a new API key
4. Copy the API key (it starts with `sk-`)
5. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your_openai_api_key
   ```

**Note:** The Waste Recognition feature uses the GPT-4 Vision model, which requires a paid OpenAI account with access to GPT-4 Vision.

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Google provider and Email/Password)
3. Create a Firestore database
4. Add your Firebase configuration to the `.env.local` file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [OpenAI](https://openai.com/)
- [Heroicons](https://heroicons.com/)
- [Lucide Icons](https://lucide.dev/)
