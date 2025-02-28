/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  safelist: [
    // Add color classes that might be dynamically generated
    'bg-blue-50', 'bg-blue-100', 'text-blue-500', 'text-blue-600', 'text-blue-800', 'border-blue-500',
    'bg-yellow-50', 'bg-yellow-100', 'text-yellow-500', 'text-yellow-600', 'text-yellow-800', 'border-yellow-500',
    'bg-red-50', 'bg-red-100', 'text-red-500', 'text-red-600', 'text-red-800', 'border-red-500',
    'bg-green-50', 'bg-green-100', 'text-green-500', 'text-green-600', 'text-green-800', 'border-green-500',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        blue: {
          50: 'var(--color-blue-50)',
          100: 'var(--color-blue-100)',
          400: 'var(--color-blue-400)',
          500: 'var(--color-blue-500)',
          600: 'var(--color-blue-600)',
          800: 'var(--color-blue-800)',
        },
        yellow: {
          50: 'var(--color-yellow-50)',
          100: 'var(--color-yellow-100)',
          400: 'var(--color-yellow-400)',
          500: 'var(--color-yellow-500)',
          600: 'var(--color-yellow-600)',
          800: 'var(--color-yellow-800)',
        },
        red: {
          50: 'var(--color-red-50)',
          100: 'var(--color-red-100)',
          400: 'var(--color-red-400)',
          500: 'var(--color-red-500)',
          600: 'var(--color-red-600)',
          800: 'var(--color-red-800)',
        },
        green: {
          50: 'var(--color-green-50)',
          100: 'var(--color-green-100)',
          400: 'var(--color-green-400)',
          500: 'var(--color-green-500)',
          600: 'var(--color-green-600)',
          800: 'var(--color-green-800)',
        },
      },
    },
  },
  plugins: [],
} 