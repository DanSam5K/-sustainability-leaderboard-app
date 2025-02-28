'use client';

import WasteRecognition from '@/components/waste/WasteRecognition';
import { Recycle, Leaf, AlertTriangle, Trash2, Zap } from 'lucide-react';

export default function WasteRecognitionPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Recognition</h1>
        <p className="text-gray-600">
          Use our AI-powered tool to identify waste items and learn how to properly dispose of them.
          Simply upload a photo and get instant recycling recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WasteRecognition />
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Waste Categories</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Recycle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Recyclable</h3>
                  <p className="text-sm text-gray-600">
                    Paper, cardboard, glass, most plastics, aluminum, and steel
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Compostable</h3>
                  <p className="text-sm text-gray-600">
                    Food scraps, yard waste, paper towels, and biodegradable materials
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Electronic Waste</h3>
                  <p className="text-sm text-gray-600">
                    Batteries, electronics, appliances, and devices
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hazardous Waste</h3>
                  <p className="text-sm text-gray-600">
                    Chemicals, paints, oils, and medical waste
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Trash2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">General Waste</h3>
                  <p className="text-sm text-gray-600">
                    Non-recyclable plastics, contaminated materials, and mixed waste
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Did You Know?</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-semibold">75%</span> of America's waste is recyclable, but we only recycle about 30% of it.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">E-waste</span> represents 2% of trash in landfills but accounts for 70% of toxic waste.
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">One recycled aluminum can</span> saves enough energy to run a TV for three hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 