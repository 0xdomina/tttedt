'use client'

import DevUserSwitcher from '@/components/DevUserSwitcher'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { logger } from '@/utils/logger'

export default function DevSwitcherPage() {
  const router = useRouter()
  const { setView } = useAppStore()
  
  const handleUserSelected = () => {
    logger.log('DevSwitcherPage', 'User selected, transitioning to app.')
    setView('app')
    router.push('/app')
  }

  return <DevUserSwitcher onUserSelected={handleUserSelected} />
}