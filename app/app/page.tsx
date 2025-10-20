'use client'

import MainAppShell from '@/components/layout/MainAppShell'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { logger } from '@/utils/logger'

export default function AppPage() {
  const router = useRouter()
  const { setView } = useAppStore()
  
  const handleLogout = () => {
    logger.log('AppPage', 'Executing handleLogout.')
    setView('auth')
    router.push('/auth')
  }

  return <MainAppShell onLogout={handleLogout} />
}