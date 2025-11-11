"use client"

export function PracticeMirror() {
  return (
    <div className="module-detailed animate-in fade-in duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="module-content flex flex-col lg:flex-row gap-6">
          <div className="module-info flex-1">
            <div className="flex items-start gap-4">
              <div className="module-icon-large w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="module-text flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Practice Mirror</h2>
                <p className="module-tagline text-gray-600 dark:text-gray-400 mb-4">
                  Your personal speaking coach with real-time feedback
                </p>
                <div className="module-features space-y-2 mb-4">
                  <div className="feature flex items-center gap-2">
                    <span className="feature-icon">🎯</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Real-time speech analysis</span>
                  </div>
                  <div className="feature flex items-center gap-2">
                    <span className="feature-icon">📊</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Confidence scoring</span>
                  </div>
                  <div className="feature flex items-center gap-2">
                    <span className="feature-icon">🔄</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Instant feedback on pacing and tone</span>
                  </div>
                </div>
                <p className="module-description text-gray-700 dark:text-gray-300">
                  Practice your speaking skills in front of our AI mirror that provides immediate, constructive feedback on your delivery, body language, and vocal variety. Perfect for preparing presentations, interviews, or important conversations.
                </p>
              </div>
            </div>
          </div>
          <div className="module-action lg:w-48 flex flex-col gap-4">
            <button className="module-btn-primary w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
              Start Practicing Now
            </button>
            <div className="module-stats grid grid-cols-2 gap-2 text-center">
              <div className="stat p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="stat-number font-bold text-gray-900 dark:text-white">Practice</div>
                <div className="stat-label text-sm text-gray-600 dark:text-gray-400">Complete Session</div>
              </div>
              <div className="stat p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="stat-number font-bold text-gray-900 dark:text-white">Grow</div>
                <div className="stat-label text-sm text-gray-600 dark:text-gray-400">Improve</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}