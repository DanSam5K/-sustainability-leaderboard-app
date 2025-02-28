'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function SignInComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get error message from URL if present
    const errorMessage = searchParams.get('error')
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage))
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError('')
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
      console.error('Google sign-in error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <Image
            src="/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            className="mr-2"
          />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-center text-sm text-red-600">
            {error}
          </p>
        </div>
      )}
    </div>
  )
} 