'use client'

import { useEffect } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import { useAppStore } from '@/store'
import { useRouter } from 'next/navigation'
import { logger } from '@/utils/logger'

export default function AuthPage() {
  const router = useRouter()
  const { setView } = useAppStore()
  
  const handleStartSignUp = () => {
    logger.log('AuthPage', 'Executing handleStartSignUp.')
    router.push('/auth/signup')
  }

  return <WelcomeScreen onStartSignUp={handleStartSignUp} />
}