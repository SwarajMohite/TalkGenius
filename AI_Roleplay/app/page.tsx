'use client';
import { useRouter } from 'next/navigation';
import { useUser, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

// Component for the animated background
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-br from-gray-900 to-black"></div>
      
      <div className="absolute left-1/4 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500 blur-[100px] opacity-20 animate-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2 transform rounded-full bg-purple-500 blur-[120px] opacity-20 animate-glow-reverse"></div>
      
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        @keyframes glow-reverse {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(0.9); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 30s infinite linear;
          background-size: 400% 400%;
        }
        .animate-glow {
          animation: glow 15s infinite ease-in-out;
        }
        .animate-glow-reverse {
          animation: glow-reverse 15s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Component for the header
function Header() {
  return (
    <nav className="relative z-10 flex w-full items-center justify-between border-b border-neutral-700 bg-gray-900 px-4 py-4">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
        <h1 className="text-base font-bold text-white md:text-2xl">TalkGenius</h1>
      </div>
      <SignedIn>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" passHref>
            <button className="w-24 transform rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-500 md:w-32">
              Dashboard
            </button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </nav>
  );
}

// Component for the CTA buttons
function CtaButtons() {
  const router = useRouter();
  const { isLoaded } = useUser();

  const handleStartInterview = () => {
    if (!isLoaded) return;
    router.push('/dashboard');
  };

  return (
    <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={handleStartInterview}
        className="w-60 transform rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
      >
        Start Interview
      </button>
      <button className="w-60 transform rounded-lg border border-gray-600 bg-gray-800 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-700">
        Practice Mode
      </button>
    </div>
  );
}

// Component for the hero section
function Hero() {
  return (
    <div className="relative z-10 mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center px-4">
      <div className="py-10 md:py-16">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold md:text-5xl lg:text-7xl">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Ace your next interview with AI</span>
        </h1>
        
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-gray-300">
          Practice with AI-powered mock interviews. Get real-time feedback, improve your answers, and boost your confidence for any job interview.
        </p>
      </div>
    </div>
  );
}

// Component for the features section
function Features() {
  const featureList = [
    {
      title: "AI-Powered Feedback",
      description: "Receive instant, personalized feedback on your answers, body language, and tone to identify areas for improvement.",
      icon: "from-blue-500 to-purple-500"
    },
    {
      title: "Customizable Interviews",
      description: "Tailor your practice sessions by choosing from a variety of interview types, industries, and difficulty levels.",
      icon: "from-green-500 to-teal-500"
    },
    {
      title: "Speech & Sentiment Analysis",
      description: "Our AI analyzes your speech patterns and emotion, helping you manage anxiety and project confidence.",
      icon: "from-orange-500 to-red-500"
    },
    {
      title: "Detailed Performance Reports",
      description: "Track your progress over time with comprehensive reports that highlight your strengths and weaknesses.",
      icon: "from-cyan-500 to-sky-500"
    },
    {
      title: "Extensive Question Library",
      description: "Practice with thousands of professionally crafted interview questions from various fields and roles.",
      icon: "from-pink-500 to-rose-500"
    },
    {
      title: "Interactive Interview Simulation",
      description: "Experience a realistic interview setting with an AI interviewer who responds to your answers in real-time.",
      icon: "from-yellow-500 to-lime-500"
    }
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 text-white">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Features that set us apart
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          TalkGenius is more than just a practice tool. It’s your personal interview coach.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map((feature, index) => (
          <div key={index} className="transform rounded-2xl border border-gray-700 bg-gray-800 p-6 transition-all duration-300 hover:scale-105 hover:border-blue-500">
            <div className={`mb-4 h-12 w-12 rounded-lg bg-gradient-to-br ${feature.icon}`}></div>
            <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <CtaButtons />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-950">
      <AnimatedBackground />
      <Header />
      <Hero />
      <Features />
    </div>
  );
}