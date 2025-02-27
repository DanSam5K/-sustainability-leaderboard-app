export default function Community() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community</h1>
        <p className="text-gray-600">Connect with other eco-warriors and join sustainability events!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3 text-center min-w-16">
                  <p className="text-sm font-medium text-green-800">MAR</p>
                  <p className="text-2xl font-bold text-green-800">15</p>
                </div>
                <div>
                  <h3 className="font-semibold">Campus Clean-up Day</h3>
                  <p className="text-sm text-gray-600 mt-1">Join us in cleaning up our campus and making it plastic-free!</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">🕒 2:00 PM</span>
                    <span className="text-sm text-gray-500">📍 Main Quad</span>
                  </div>
                </div>
              </div>
              <button className="mt-3 text-green-600 hover:text-green-800 text-sm font-medium">Join Event →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-3 text-center min-w-16">
                  <p className="text-sm font-medium text-blue-800">MAR</p>
                  <p className="text-2xl font-bold text-blue-800">22</p>
                </div>
                <div>
                  <h3 className="font-semibold">Sustainable Living Workshop</h3>
                  <p className="text-sm text-gray-600 mt-1">Learn practical tips for reducing your environmental impact.</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">🕒 4:00 PM</span>
                    <span className="text-sm text-gray-500">📍 Room 101</span>
                  </div>
                </div>
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">Join Event →</button>
            </div>
          </div>
        </div>

        {/* Discussion Forum */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Discussion Forum</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">New Post</button>
          </div>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Tips for reducing plastic waste?</h3>
                  <p className="text-sm text-gray-600 mt-1">Looking for creative ways to reduce plastic usage in daily life...</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Hot Topic</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>👤 Sarah K.</span>
                <span>💬 12 replies</span>
                <span>⏰ 2 hours ago</span>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Starting a campus garden</h3>
                  <p className="text-sm text-gray-600 mt-1">Would anyone be interested in helping start a community garden?</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">New</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>👤 Mike R.</span>
                <span>💬 5 replies</span>
                <span>⏰ 5 hours ago</span>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Eco-friendly transportation options</h3>
                  <p className="text-sm text-gray-600 mt-1">Let's discuss the best ways to reduce our carbon footprint...</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>👤 Alex M.</span>
                <span>💬 8 replies</span>
                <span>⏰ 1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eco Tips */}
        <div className="bg-white shadow rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Eco Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <span className="text-2xl">💡</span>
              <h3 className="font-medium mt-2">Energy Saving</h3>
              <p className="text-sm text-gray-600 mt-1">Turn off lights when leaving a room to save energy.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <span className="text-2xl">🚰</span>
              <h3 className="font-medium mt-2">Water Conservation</h3>
              <p className="text-sm text-gray-600 mt-1">Fix leaky faucets to save thousands of gallons annually.</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <span className="text-2xl">♻️</span>
              <h3 className="font-medium mt-2">Waste Reduction</h3>
              <p className="text-sm text-gray-600 mt-1">Use reusable bags for shopping to reduce plastic waste.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 