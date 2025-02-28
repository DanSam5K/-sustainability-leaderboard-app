import Image from "next/image";

export default function Home() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EcoLeader</h1>
        <p className="text-gray-600">Track your sustainability impact and compete with your peers!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Impact</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-600">125 kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Points Earned</p>
              <p className="text-2xl font-bold text-blue-600">750</p>
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Challenges</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Bike to School Week</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-700">Zero Waste Challenge</span>
            </li>
          </ul>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Recycled Materials</span>
              <span className="text-sm font-semibold text-green-600">+10 pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Used Reusable Bottle</span>
              <span className="text-sm font-semibold text-green-600">+5 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
