"use client"

export function GamesSection() {
  const games = [
    {
      id: 1,
      icon: "🎯",
      title: "Quick Response",
      description: "Think on your feet with timed responses"
    },
    {
      id: 2, 
      icon: "🧩",
      title: "Word Connect",
      description: "Build persuasive arguments word by word"
    },
    {
      id: 3,
      icon: "🏆", 
      title: "Debate Champion",
      description: "Compete in rapid-fire debate rounds"
    }
  ]

  return (
    <div className="games-section">
      <div className="section-header text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Interactive Games</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Fun games to enhance your communication skills
        </p>
      </div>
      
      <div className="coming-soon bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="coming-soon-icon text-6xl mb-6">🎮</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Coming Soon</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          We're working on exciting games to make learning even more engaging!
        </p>
        
        <div className="games-preview grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {games.map((game) => (
            <div key={game.id} className="game-card bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
              <div className="game-icon text-3xl mb-4">{game.icon}</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{game.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}