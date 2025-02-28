'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Loader2, AlertTriangle } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function EcoChatbot() {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi there! I\'m EcoBot, your sustainability assistant. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Reset any previous API errors
    setApiError(null);

    // Add user message
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format messages for API
      const apiMessages = messages
        .concat(userMessage)
        .map(({ role, content }) => ({
          role,
          content,
        }));

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await response.json();

      // Check if the response contains a message
      if (data.message) {
        // Check if the message is an error message about API key
        if (data.message.includes('API key') || data.message.includes('OpenAI')) {
          throw new Error(data.message);
        }

        // Add assistant response
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message },
        ]);
      } else if (data.error) {
        // Handle explicit error field
        throw new Error(data.error);
      } else {
        // Handle unexpected response format
        throw new Error('Received an invalid response from the server');
      }
    } catch (error: any) {
      console.error('Error in chat:', error);

      let errorMessage = 'Sorry, I encountered an error. Please try again later.';
      let apiErrorMessage = 'Unknown error';

      // Ensure proper error handling for different error types
      if (typeof error === 'string') {
        errorMessage = error;
        apiErrorMessage = error;
      } else if (error instanceof Error) {
        // Handle standard Error objects
        if (error.message?.includes('API key') || error.message?.includes('OpenAI')) {
          errorMessage = 'The OpenAI API key is missing or invalid. Please check your environment configuration.';
          apiErrorMessage = 'OpenAI API key configuration issue';
        } else if (error.message?.includes('rate limit')) {
          errorMessage = 'The OpenAI API rate limit has been reached. Please try again in a few moments.';
          apiErrorMessage = 'Rate limit exceeded';
        } else {
          errorMessage = error.message || 'Unknown error occurred';
          apiErrorMessage = error.message || 'Unknown error';
        }
      } else if (error && typeof error === 'object') {
        // Handle object errors by converting to string
        try {
          const errorString = JSON.stringify(error);
          errorMessage = `Error: ${errorString}`;
          apiErrorMessage = 'Object error: ' + errorString.substring(0, 50) + (errorString.length > 50 ? '...' : '');
        } catch (e) {
          errorMessage = 'An unidentifiable error occurred';
          apiErrorMessage = 'Unidentifiable error';
        }
      }

      setApiError(apiErrorMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-green-600">EcoBot Assistant</h2>
        <p className="text-sm text-gray-500">
          Ask me anything about sustainability and eco-friendly practices!
        </p>
      </div>

      {apiError && (
        <div className="p-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center text-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <p className="text-sm font-medium">API Error: {apiError}</p>
          </div>
          <p className="text-xs text-red-600 mt-1">
            {apiError.includes('API key') || apiError.includes('OpenAI')
              ? 'Please add a valid OpenAI API key to your .env.local file.'
              : 'Please check your environment configuration or try again later.'}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${message.role === 'user'
                ? 'bg-green-500 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
              <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about sustainability..."
          disabled={isLoading || !user}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || !user}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </form>

      {!user && (
        <div className="p-4 bg-yellow-50 text-yellow-800 text-center text-sm">
          Please sign in to chat with EcoBot
        </div>
      )}
    </div>
  );
} 