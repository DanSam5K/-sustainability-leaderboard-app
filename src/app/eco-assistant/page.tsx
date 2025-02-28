'use client';

import EcoChatbot from '@/components/chat/EcoChatbot';

export default function EcoAssistantPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Assistant</h1>
        <p className="text-gray-600">
          Chat with our AI-powered sustainability assistant to get personalized eco-friendly tips,
          learn about environmental topics, and discover ways to increase your positive impact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EcoChatbot />
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested Topics</h2>
            <ul className="space-y-3">
              {[
                "How can I reduce my water usage?",
                "What are the best ways to reduce plastic waste?",
                "How does recycling help the environment?",
                "What are some energy-saving tips for students?",
                "How can I calculate my carbon footprint?",
                "What sustainable transportation options are available?",
              ].map((topic, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Did You Know?</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-semibold">Recycling one aluminum can</span> saves enough energy to run a TV for three hours.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">A five-minute shower</span> uses 10-25 gallons of water, while a bath uses up to 70 gallons.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">LED bulbs</span> use up to 80% less energy than traditional incandescent bulbs and last 25 times longer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 