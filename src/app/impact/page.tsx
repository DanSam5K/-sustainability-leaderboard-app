export default function Impact() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Impact</h1>
        <p className="text-gray-600">Track your environmental impact and sustainability achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CO2 Savings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">CO₂ Savings</h2>
          <div className="space-y-4">
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">CO₂ Savings Chart Placeholder</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-green-600">25 kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-green-600">125 kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Reduction */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Waste Reduction</h2>
          <div className="space-y-4">
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Waste Reduction Chart Placeholder</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Plastic Saved</p>
                <p className="text-2xl font-bold text-blue-600">5 kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Items Recycled</p>
                <p className="text-2xl font-bold text-blue-600">42</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <span className="text-2xl">🌱</span>
              <p className="mt-2 font-medium">Green Starter</p>
              <p className="text-sm text-gray-500">First eco-action</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <span className="text-2xl">🚲</span>
              <p className="mt-2 font-medium">Cycle Champion</p>
              <p className="text-sm text-gray-500">10 bike rides</p>
            </div>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">♻️</span>
                <div>
                  <p className="font-medium">Recycled Materials</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">+10 pts</span>
            </div>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🚰</span>
                <div>
                  <p className="font-medium">Used Reusable Bottle</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <span className="text-green-600 font-medium">+5 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 