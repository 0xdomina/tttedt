'use client'

const isLoggingEnabled = true // Set to false in production
const isClient = typeof window !== 'undefined'

const getTimestamp = () => new Date().toISOString()
const formatOrigin = (origin: string) => `[${origin}]`.padEnd(30, ' ')

export const logger = {
  log: (origin: string, message: string, ...data: any[]) => {
    if (!isLoggingEnabled) return
    
    if (isClient) {
      console.log(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: blue; font-weight: bold;',
        'color: black;',
        ...data
      )
    } else {
      console.log(`[${getTimestamp()}] ${formatOrigin(origin)} ${message}`, ...data)
    }
  },

  warn: (origin: string, message: string, ...data: any[]) => {
    if (!isLoggingEnabled) return
    
    if (isClient) {
      console.warn(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: orange; font-weight: bold;',
        'color: black;',
        ...data
      )
    } else {
      console.warn(`[${getTimestamp()}] ${formatOrigin(origin)} ${message}`, ...data)
    }
  },

  error: (origin: string, message: string, ...data: any[]) => {
    if (!isLoggingEnabled) return
    
    if (isClient) {
      console.error(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: red; font-weight: bold;',
        'color: black;',
        ...data
      )
    } else {
      console.error(`[${getTimestamp()}] ${formatOrigin(origin)} ${message}`, ...data)
    }
  }
}

// Global error handler for non-React errors (client-side only)
if (isClient) {
  window.addEventListener('error', (e: ErrorEvent) => {
    logger.error('GlobalErrorHandler', 'Uncaught error detected!', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      error: e.error
    })
  })
}
