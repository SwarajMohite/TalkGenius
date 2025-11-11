"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthChange } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'
import { UserGreeting } from '@/components/dashboard/user-greeting'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { TimeTracker } from '@/components/dashboard/time-tracker'
import { Leaderboard } from '@/components/dashboard/leaderboard'
import { Navigation } from '@/components/dashboard/navigation'
import { HomeSection } from '@/components/dashboard/home-section'
import { GamesSection } from '@/components/dashboard/games-section'
import { ProgressSection } from '@/components/dashboard/progress-section'
import { Sparkles, Rocket, Target, Zap } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('home')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      if (!user) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />
      case 'games':
       return <HomeSection />
      case 'progress':
        return <ProgressSection />
      case 'leaderboard':
        return <Leaderboard />
      default:
        return <HomeSection />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200 dark:bg-cyan-900 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="relative pt-20">
        {activeSection === 'home' && (
          <>
            {/* Enhanced Header Section */}
            <div className="container mx-auto px-6 mb-8">
              <div className="max-w-7xl mx-auto">
                <UserGreeting />
                
                {/* Quick Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                        <Rocket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">6</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Learning Modules</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">60min</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Daily Goal</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">Auto</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Progress Tracking</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Dashboard Grid */}
            <div className="container mx-auto px-6 pb-12">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  
                  {/* Main Content Area - 3/4 width on large screens */}
                  <div className="xl:col-span-3 space-y-8">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles className="w-8 h-8 text-yellow-300" />
                          <h2 className="text-2xl font-bold">Welcome to Your Learning Hub</h2>
                        </div>
                        <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                          Master communication skills with AI-powered practice modules. 
                          Your progress is automatically tracked - just focus on learning!
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                            🎯 Real-time Feedback
                          </span>
                          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                            🤖 AI Practice Partners
                          </span>
                          <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                            📊 Auto Progress Tracking
                          </span>
                        </div>
                      </div>
                      
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
                    </div>

                    {/* Learning Modules Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 transition-all duration-300 hover:shadow-2xl">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                            <Rocket className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Modules</h2>
                            <p className="text-gray-600 dark:text-gray-400">Choose your practice session</p>
                          </div>
                        </div>
                        <HomeSection />
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Sidebar - 1/4 width on large screens */}
                  <div className="xl:col-span-1 space-y-8">
                    {/* Time Tracker Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Live Timer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Auto-tracking active</p>
                        </div>
                      </div>
                      <TimeTracker />
                    </div>

                    {/* Progress Chart Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Progress</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Your journey</p>
                        </div>
                      </div>
                      <ProgressChart />
                    </div>

                    {/* Leaderboard Card
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performers</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Community leaders</p>
                        </div>
                      </div>
                      <Leaderboard />
                    </div> */}

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl p-6 text-white">
                      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button 
                          onClick={() => setActiveSection('progress')}
                          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-left"
                        >
                          📊 View Full Progress
                        </button>
                        <button 
                          onClick={() => setActiveSection('leaderboard')}
                          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-left"
                        >
                          🏆 See Leaderboard
                        </button>
                        <button className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 text-left">
                          🎯 Set Daily Goal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Other Sections */}
        {activeSection !== 'home' && (
          <div className="container mx-auto px-6 py-8 max-w-7xl">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl">
              {renderSection()}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © 2025 TalkGenius. Elevating communication skills.
            </div>
            
          </div>
        </div>
      </footer>
    </div>
  )
}