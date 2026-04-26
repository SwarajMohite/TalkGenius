"use client"

import { useState } from 'react'
import { setupDatabase, initializeSampleData } from '@/lib/supabase/setup'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Users, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminSetup() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [sampleDataStatus, setSampleDataStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSetupDatabase = async () => {
    setSetupStatus('loading')
    setMessage('Setting up database tables...')
    
    const result = await setupDatabase()
    
    if (result.success) {
      setSetupStatus('success')
      setMessage('Database setup completed successfully!')
    } else {
      setSetupStatus('error')
      setMessage('Database setup failed. Check console for details.')
    }
  }

  const handleInitializeSampleData = async () => {
    setSampleDataStatus('loading')
    setMessage('Initializing sample data...')
    
    const result = await initializeSampleData()
    
    if (result.success) {
      setSampleDataStatus('success')
      setMessage('Sample data initialized successfully!')
    } else {
      setSampleDataStatus('error')
      setMessage('Sample data initialization failed. Check console for details.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading': return <Loader2 className="w-5 h-5 animate-spin" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            TalkGenius Database Setup
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Initialize your database for progress tracking and leaderboards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 shadow-2xl dark:bg-gray-800/80 dark:border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-500" />
                Database Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Create the necessary tables and views for progress tracking and leaderboards.
              </p>
              <Button
                onClick={handleSetupDatabase}
                disabled={setupStatus === 'loading'}
                className="w-full"
              >
                {getStatusIcon(setupStatus)}
                {setupStatus === 'loading' ? 'Setting up...' : 'Setup Database'}
              </Button>
              {setupStatus !== 'idle' && (
                <div className={`text-sm p-3 rounded-lg ${
                  setupStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  setupStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  Database setup {setupStatus}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 shadow-2xl dark:bg-gray-800/80 dark:border-green-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="w-6 h-6 text-green-500" />
                Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Initialize with sample users and progress data for testing the leaderboard.
              </p>
              <Button
                onClick={handleInitializeSampleData}
                disabled={sampleDataStatus === 'loading'}
                className="w-full"
                variant="outline"
              >
                {getStatusIcon(sampleDataStatus)}
                {sampleDataStatus === 'loading' ? 'Initializing...' : 'Add Sample Data'}
              </Button>
              {sampleDataStatus !== 'idle' && (
                <div className={`text-sm p-3 rounded-lg ${
                  sampleDataStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  sampleDataStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  Sample data {sampleDataStatus}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {message && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl dark:bg-gray-800/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-900 dark:text-white font-medium">{message}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}