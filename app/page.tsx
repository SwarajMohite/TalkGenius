"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { FeatureCard } from "@/components/feature-card"
import { StatsCounter } from "@/components/stats-counter"
import { useRouter } from "next/navigation"


import {
  Mic,
  Brain,
  TrendingUp,
  FileText,
  Lightbulb,
  Trophy,
  Play,
  ArrowRight,
  Users,
  Building,
  Target,
} from "lucide-react"

export default function HomePage() {

    const router = useRouter() // Add this line

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          
          <span className="font-space-grotesk text-xl font-bold text-foreground">TalkGenius</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col items-center justify-center text-center text-white"
        style={{ backgroundImage: "url('/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="bg-black/50 p-8 rounded-2xl">
          <h1 className="mb-6 font-space-grotesk text-5xl font-bold leading-tight md:text-6xl">
            TalkGenius – AI That Makes You{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Unstoppable</span>{" "}
            in Any Discussion
          </h1>
          <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
            Master interviews, pitches, public speaking, and debates with AI-powered real-time coaching.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
             <Button 
        size="lg" 
        className="group"
        onClick={() => router.push('/login')} // Add this
      >
        Start Practicing
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
            <Button size="lg" variant="outline" className="group bg-transparent">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="relative z-10 px-6 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 font-space-grotesk text-3xl font-bold text-foreground">From Nervous to Confident</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Struggling with nervousness, filler words, or poor eye contact during important conversations? You're
                  not alone. These challenges hold back countless talented individuals.
                </p>
                <p className="leading-relaxed">
                  TalkGenius transforms your communication skills with AI-powered real-time feedback, helping you speak
                  with confidence and clarity in any situation.
                </p>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">AI Feedback: Reduce filler words</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse delay-300" />
                      <span className="text-sm text-muted-foreground">Posture: Maintain eye contact</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-700" />
                      <span className="text-sm text-muted-foreground">Pace: Perfect speaking rhythm</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      

{/* ✨ Features Section */}
<section
  id="features"
  className="relative bg-cover bg-center py-20"
  style={{ backgroundImage: "url('/features.jpg')" }} 
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-black/50"></div>  

  <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
    <h1 className="text-4xl font-bold text-white mb-4">
      Powerful features for every speaker
    </h1>
    <h6 className="text-gray-400 text-lg mb-12">
      Comprehensive AI coaching tools designed to elevate your communication skills
    </h6>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/simulation.png" alt="Live Simulation" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Live Simulation</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Practice real-world scenarios with AI-powered conversation partners that adapt to your skill level.
        </p>
      </div>

      {/* Feature 2 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/feedback.png" alt="Real-time Feedback" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Real-time Feedback</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Get instant insights on your speaking pace, clarity, confidence, and body language.
        </p>
      </div>

      {/* Feature 3 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/growth.png" alt="Growth Tracker" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Growth Tracker</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Monitor your progress with detailed analytics and personalized improvement recommendations.
        </p>
      </div>

      {/* Feature 4 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/resume.png" alt="Resume Matching" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Interview Practice</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Tailor your interview responses to specific job descriptions and company cultures.
        </p>
      </div>

      {/* Feature 5 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/inspiration.png" alt="Inspiration Analyzer" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Inspiration Analyzer</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Learn from great speakers and incorporate their techniques into your own style.
        </p>
      </div>

      {/* Feature 6 */}
      <div className="p-6 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 
                      bg-white text-gray-900 dark:bg-[#0a1a2f] dark:text-white">
        <img src="/gamified.png" alt="Gamified Practice" className="w-20 h-20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Gamified Practice</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Earn achievements and compete with friends while building your communication skills.
        </p>
      </div>
    </div>
  </div>
</section>








      {/* Interactive Demo Section */}
      <section
        className="relative z-10 px-6 py-20 text-white"
        style={{ backgroundImage: "url('/video.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="mx-auto max-w-4xl text-center bg-black/50 p-6 rounded-xl">
  <h2 className="mb-6 font-space-grotesk text-3xl font-bold">See TalkGenius in Action</h2>
  <div className="relative mx-auto max-w-2xl">
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          {/* Add a simple test to check if video loads */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            controls // Add controls temporarily to debug
            className="w-full h-full object-cover"
            onError={(e) => console.error('Video error:', e)}
            onLoadStart={() => console.log('Video loading...')}
            onCanPlay={() => console.log('Video can play')}
          >
            <source src="/TalkGenius.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
      </section>

      {/* Impact Section */}
      <section className="relative z-10 px-6 py-20 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-space-grotesk text-3xl font-bold text-foreground">
              Empowering every voice to be heard
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <StatsCounter end={50000} suffix="+" />
              <p className="mt-2 text-muted-foreground">Members</p>
              <Users className="mx-auto mt-4 h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <StatsCounter end={500} suffix="+" />
              <p className="mt-2 text-muted-foreground">Onboard</p>
              <Building className="mx-auto mt-4 h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <StatsCounter end={95} suffix="%" />
              <p className="mt-2 text-muted-foreground">Success Rate</p>
              <Target className="mx-auto mt-4 h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* About / Vision Section */}
      <section
        className="relative z-10 px-6 py-20 text-white"
        style={{ backgroundImage: "url('/about.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="mx-auto max-w-4xl text-center bg-black/50 p-8 rounded-2xl">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-12">
              <blockquote className="font-space-grotesk text-2xl font-medium leading-relaxed">
                "The silent mentor guiding every student to be heard."
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-20 bg-background">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-space-grotesk text-3xl font-bold text-foreground">
            Ready to speak with confidence?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Start your TalkGenius journey today and transform how you communicate.
          </p>
          <Button 
  size="lg" 
  className="group"
  onClick={() => router.push('/login')} // Add this
>
  Get Started Now
  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 px-6 py-12 bg-background">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-space-grotesk font-bold text-foreground">TalkGenius</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered communication coaching for everyone.</p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About : TY, Computer Department, GP Pune, Pune</a></li>
                {/* <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li> */}
                <li><a href="#" className="hover:text-foreground transition-colors">Contact : swarajmohite16@gmail.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Team</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Mohite Swaraj Sanjay</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sarthak Nalawade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Siddhi More</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Nikita Nale</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            © 2025 TalkGenius. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
