'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { ChatMessage } from '@/types';
import PaperAirplaneIcon from '@heroicons/react/24/outline/PaperAirplaneIcon';
import { addMessage, subscribeToMessages } from '@/lib/firebase/db';

interface Props {
  challengeId?: string;
}

export default function ChatWindow({ challengeId }: Props) {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((updatedMessages) => {
      setMessages(updatedMessages);
    }, challengeId);

    return () => unsubscribe();
  }, [challengeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsLoading(true);
    try {
      await addMessage({
        content: newMessage.trim(),
        userId: user.id,
        userName: user.name || '',
        userImage: user.image || '',
        challengeId,
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex items-start space-x-3 mb-4 ${message.userId === user?.id ? 'flex-row-reverse space-x-reverse' : ''
              }`}
          >
            {message.userImage && (
              <img
                src={message.userImage}
                alt={message.userName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`flex flex-col ${message.userId === user?.id ? 'items-end' : 'items-start'
                }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{message.userName}</span>
                <span className="text-xs text-gray-400">
                  {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <div
                className={`mt-1 px-4 py-2 rounded-lg ${message.userId === user?.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-900'
                  }`}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 