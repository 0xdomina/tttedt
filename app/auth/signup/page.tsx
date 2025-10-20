'use client'

import SignUpFlow from '@/components/SignUpFlow'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { logger } from '@/utils/logger'

export default function SignUpPage() {
  const router = useRouter()
  const { setView } = useAppStore()
  
  const handleSignUpComplete = () => {
    logger.log('SignUpPage', 'Executing handleSignUpComplete.')
    setView('dev-switcher')
    router.push('/dev-switcher')
  }
  
  const handleBackToWelcome = () => {
    logger.log('SignUpPage', 'Executing handleBackToWelcome.')
    router.push('/auth')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="h-screen w-full max-w-md md:h-auto md:max-h-[750px] bg-white md:rounded-2xl md:shadow-lg">
        <SignUpFlow onComplete={handleSignUpComplete} onBack={handleBackToWelcome} />
      </div>
    </div>
  )
}