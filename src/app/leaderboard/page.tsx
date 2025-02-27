export default function Leaderboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <p className="text-gray-600">See how you rank against other eco-warriors!</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          {/* Top 3 Leaders */}
          <div className="flex justify-center items-end space-x-8 mb-8">
            {/* Second Place */}
            <div className="text-center">
              <div className="w-20 h-24 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥈</span>
              </div>
              <p className="mt-2 font-semibold">Emma</p>
              <p className="text-sm text-gray-600">850 pts</p>
            </div>

            {/* First Place */}
            <div className="text-center">
              <div className="w-20 h-32 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥇</span>
              </div>
              <p className="mt-2 font-semibold">Alex</p>
              <p className="text-sm text-gray-600">920 pts</p>
            </div>

            {/* Third Place */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥉</span>
              </div>
              <p className="mt-2 font-semibold">James</p>
              <p className="text-sm text-gray-600">780 pts</p>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-2">
            {[4, 5, 6, 7, 8].map((position) => (
              <div key={position} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="w-8 text-center text-gray-500">#{position}</span>
                  <span className="font-medium">User {position}</span>
                </div>
                <span className="text-gray-600">{1000 - position * 50} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 