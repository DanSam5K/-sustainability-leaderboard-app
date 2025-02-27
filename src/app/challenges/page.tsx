export default function Challenges() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Challenges</h1>
        <p className="text-gray-600">Take on sustainability challenges and earn points!</p>
      </div>

      {/* Active Challenges */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Challenges</h2>
        <div className="grid gap-4">
          <div className="border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Bike to School Week</h3>
                <p className="text-gray-600 text-sm mt-1">Use your bike for transportation this week</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">In Progress</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>3/7 days</span>
                <span>50 pts</span>
              </div>
            </div>
          </div>

          <div className="border border-yellow-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Zero Waste Challenge</h3>
                <p className="text-gray-600 text-sm mt-1">Minimize your waste production</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Just Started</span>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>1/7 days</span>
                <span>75 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Challenges */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Challenges</h2>
        <div className="grid gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Energy Saver</h3>
                <p className="text-gray-600 text-sm mt-1">Reduce your energy consumption for a week</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">100 pts</span>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">Start Challenge →</button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Meatless Monday</h3>
                <p className="text-gray-600 text-sm mt-1">Go vegetarian every Monday for a month</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">150 pts</span>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">Start Challenge →</button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Water Guardian</h3>
                <p className="text-gray-600 text-sm mt-1">Track and reduce your water consumption</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">125 pts</span>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm">Start Challenge →</button>
          </div>
        </div>
      </div>
    </div>
  )
} 