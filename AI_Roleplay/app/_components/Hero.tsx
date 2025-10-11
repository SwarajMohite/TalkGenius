import React from "react";

export function Hero() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      {/* Decorative borders */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>
      
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          Ace your next interview with AI
        </h1>
        
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400">
          Practice with AI-powered mock interviews. Get real-time feedback, 
          improve your answers, and boost your confidence for any job interview.
        </p>
        
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Start Interview
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Practice Mode
          </button>
        </div>
        
        <div className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <div className="aspect-[16/9] h-auto w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  AI Mock Interview Preview
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive interview simulation coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}