export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900">Authentication Error</h2>
        <p className="mt-2 text-sm text-gray-600">
          There was an error signing in. Please try again.
        </p>
        <a
          href="/auth/signin"
          className="mt-4 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          Back to Sign In
        </a>
      </div>
    </div>
  )
} 