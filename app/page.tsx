'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store'
import { logger } from '@/utils/logger'

export default function Home() {
  const router = useRouter()
  const { view } = useAppStore()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            logger.log('ServiceWorker', 'Registration successful', registration.scope)
          })
          .catch((error) => {
            logger.error('ServiceWorker', 'Registration failed', error)
          })
      })
    }

    router.push(view === 'app' ? '/app' : view === 'dev-switcher' ? '/dev-switcher' : '/auth')
  }, [view, router])

  return null
}