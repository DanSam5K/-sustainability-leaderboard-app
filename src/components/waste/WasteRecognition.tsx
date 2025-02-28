'use client';

import { useState, useRef } from 'react';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { Loader2, Upload, Camera, Trash2, Recycle, Leaf, AlertTriangle, Zap } from 'lucide-react';
import Image from 'next/image';

type WasteAnalysisResult = {
  itemName: string;
  category: string;
  disposalInstructions: string;
  sustainableAlternatives: string;
  environmentalImpact: string;
  confidenceLevel: string;
};

export default function WasteRecognition() {
  const { user } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }

      setImageFile(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !user) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/waste-recognition', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      setResult(data);
    } catch (error: any) {
      console.error('Error analyzing waste:', error);
      // Ensure error message is a string, even if error is an object
      let errorMessage = 'Failed to analyze image';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message || 'Failed to analyze image';
      } else if (error && typeof error === 'object') {
        // Handle case where error is an object
        errorMessage = JSON.stringify(error);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'recyclable':
        return <Recycle className="h-6 w-6 text-blue-500" />;
      case 'compostable':
        return <Leaf className="h-6 w-6 text-green-500" />;
      case 'electronic waste':
        return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'hazardous waste':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Trash2 className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'recyclable':
        return 'blue';
      case 'compostable':
        return 'green';
      case 'electronic waste':
        return 'yellow';
      case 'hazardous waste':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Waste Recognition</h2>
      <p className="text-gray-600 mb-6">
        Upload a photo of a waste item to get AI-powered recycling recommendations.
      </p>

      {!user ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          <p>Sign in to use the waste recognition feature.</p>
        </div>
      ) : (
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="relative w-full max-w-md mx-auto h-64">
                    <Image
                      src={selectedImage}
                      alt="Selected waste item"
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div className="flex justify-center space-x-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      disabled={loading}
                    >
                      Change Image
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={loading || !selectedImage}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Analyze'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-500">
                    Drag and drop an image here, or click to select
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">{error}</p>
                  {error.includes('API key') && (
                    <p className="text-sm mt-1">
                      To use this feature, you need to add a valid OpenAI API key to your .env.local file.
                      The API key should start with 'sk-'.
                    </p>
                  )}
                  {error.includes('GPT-4 Vision') && (
                    <p className="text-sm mt-1">
                      This feature requires access to the GPT-4 Vision model. Make sure your OpenAI account has access to this model.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className={`bg-${getCategoryColor(result.category)}-100 p-4 border-b`}>
                <div className="flex items-center">
                  {getCategoryIcon(result.category)}
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-gray-900">{result.itemName}</h3>
                    <p className={`text-${getCategoryColor(result.category)}-700 font-medium`}>
                      {result.category}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 bg-${getCategoryColor(result.category)}-200 text-${getCategoryColor(result.category)}-800 rounded-full text-xs font-medium`}>
                      {result.confidenceLevel} Confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Disposal Instructions</h4>
                  <p className="text-gray-700 mt-1">{result.disposalInstructions}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Sustainable Alternatives</h4>
                  <p className="text-gray-700 mt-1">{result.sustainableAlternatives}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="font-semibold text-green-800">Environmental Impact</h4>
                  <p className="text-green-700 mt-1">{result.environmentalImpact}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 