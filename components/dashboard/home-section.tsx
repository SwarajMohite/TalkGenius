"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mic, 
  Users, 
  MessageSquare, 
  GitMerge, 
  Star, 
  Play, 
  Target,
  Zap,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'

export function HomeSection() {
  const router = useRouter()
  
  const modules = [
    {
      id: 1,
      title: "Practice Mirror",
      description: "Your personal speaking coach with real-time feedback",
      features: ["Real-time speech analysis", "Confidence scoring", "Instant feedback"],
      buttonText: "Start Practicing Now",
      stats: ["98%", "4.8★"],
      color: "blue",
      icon: Mic,
      gradient: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
      route: "http://localhost:5505"
    },
    {
      id: 2,
      title: "AI Roleplay", 
      description: "Realistic conversation practice with AI characters",
      features: ["Multiple character scenarios", "Customizable situations", "Natural conversation flow"],
      buttonText: "Start Roleplay Session",
      stats: ["50+", "Scenarios"],
      color: "green",
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      badge: "Interactive",
      route: "http://localhost:3001/dashboard/" // AI Roleplay app URL
    },
    {
      id: 3,
      title: "Group Discussion",
      description: "Master the dynamics of group conversations", 
      features: ["3-6 AI participants", "Turn-taking analysis", "Leadership scoring"],
      buttonText: "Join Group Discussion",
      stats: ["Dynamic", "Groups"],
      color: "purple",
      icon: MessageSquare,
      gradient: "from-purple-500 to-pink-500",
      badge: "Multi-User",
      route: "http://localhost:3002" // Updated to port 3002 for Group Discussion
    },
    {
      id: 4,
      title: "AI Debate",
      description: "Sharpen your arguments against intelligent opponents",
      features: ["Challenging AI opponents", "Multiple debate formats", "Argument strength scoring"],
      buttonText: "Start a Debate", 
      stats: ["Pro", "Level"],
      color: "red",
      icon: GitMerge,
      gradient: "from-red-500 to-orange-500",
      badge: "Challenging",
      route: "http://127.0.0.1:5500/modules/AI_Debate/debate.html" // AI Debate internal route
    },
    {
      id: 5,
      title: "Inspiration Analyzer",
      description: "Learn from the world's most inspiring speakers",
      features: ["Famous speech analysis", "Rhetorical device identification", "Personalized learning insights"],
      buttonText: "Analyze Speeches",
      stats: ["100+", "Speeches"],
      color: "yellow",
      icon: Star,
      gradient: "from-amber-500 to-yellow-500",
      badge: "Learn",
      route: "http://localhost:5173" // Inspiration Analyzer URL
    },
    {
      id: 6,
      title: "Lab Simulation",
      description: "Advanced speaking scenarios in controlled environments",
      features: ["Real-world speaking scenarios", "Performance analytics", "Custom environment settings"],
      buttonText: "Enter Lab Simulation",
      stats: ["Advanced", "Level"],
      color: "indigo",
      icon: Mic,
      gradient: "from-indigo-500 to-purple-600",
      badge: "Experimental",
      route: "http://localhost:8000/" // Lab Simulation URL
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: { 
        bg: 'bg-blue-50 dark:bg-blue-900/20', 
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        light: 'bg-blue-500/10'
      },
      green: { 
        bg: 'bg-green-50 dark:bg-green-900/20', 
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
        light: 'bg-green-500/10'
      },
      purple: { 
        bg: 'bg-purple-50 dark:bg-purple-900/20', 
        text: 'text-purple-600 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-800',
        light: 'bg-purple-500/10'
      },
      red: { 
        bg: 'bg-red-50 dark:bg-red-900/20', 
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
        light: 'bg-red-500/10'
      },
      yellow: { 
        bg: 'bg-amber-50 dark:bg-amber-900/20', 
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        light: 'bg-amber-500/10'
      }
    }
    return colors[color] || colors.blue
  }

  const handleModuleClick = (module: any) => {
    if (module.route.startsWith('http')) {
      // External URL - redirect in same tab
      window.location.href = module.route
    } else {
      // Internal route - use Next.js router
      router.push(module.route)
    }
  }

  return (
    <div className="space-y-6">
      {modules.map((module, index) => {
        const color = getColorClasses(module.color)
        const IconComponent = module.icon
        
        return (
          <div 
            key={module.id} 
            className="group animate-in fade-in duration-500 slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`
              relative bg-white dark:bg-gray-800 rounded-3xl shadow-sm border transition-all duration-300 
              hover:shadow-2xl hover:scale-[1.02] hover:border-opacity-50
              ${color.border} overflow-hidden
            `}>
              {/* Background Gradient Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-3xl border-2 ${color.border} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}></div>
              
              <div className="relative p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-6">
                      {/* Icon Container */}
                      <div className={`relative p-4 rounded-2xl ${color.bg} ${color.border} border`}>
                        <div className={`p-3 rounded-xl ${color.light}`}>
                          <IconComponent className={`w-8 h-8 ${color.text}`} />
                        </div>
                        
                        {/* Badge */}
                        <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${color.text} ${color.bg} border ${color.border} backdrop-blur-sm`}>
                          {module.badge}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {module.title}
                          </h2>
                          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            {module.description}
                          </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3">
                          {module.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${color.bg}`}></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center gap-6 pt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>10-15 min sessions</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Zap className="w-4 h-4" />
                            <span>AI Powered</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>Progress Tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Panel */}
                  <div className="lg:w-80 flex flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {module.stats.map((stat, i) => (
                        <div 
                          key={i}
                          className={`p-4 rounded-2xl ${color.bg} border ${color.border} text-center transition-all duration-300 group-hover:scale-105`}
                        >
                          <div className={`text-2xl font-bold ${color.text} mb-1`}>
                            {stat}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                            {i === 0 ? 'Success Rate' : 'Rating'}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={() => handleModuleClick(module)}
                      className={`
                        group relative w-full py-4 px-6 rounded-2xl font-bold text-white 
                        bg-gradient-to-r ${module.gradient} 
                        hover:shadow-lg hover:scale-105 transform transition-all duration-300
                        flex items-center justify-center gap-3
                      `}
                    >
                      <Play className="w-5 h-5" />
                      {module.buttonText}
                      
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Quick Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>500+ users</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Beginner Friendly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}