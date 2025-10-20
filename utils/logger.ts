
const isLoggingEnabled = true; // Set to false in production

const getTimestamp = () => new Date().toISOString();

const formatOrigin = (origin: string) => `[${origin}]`.padEnd(30, ' ');

export const logger = {
  log: (origin: string, message: string, ...data: any[]) => {
    if (isLoggingEnabled) {
      console.log(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: blue; font-weight: bold;',
        'color: black;',
        ...data
      );
    }
  },
  warn: (origin: string, message: string, ...data: any[]) => {
    if (isLoggingEnabled) {
      console.warn(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: orange; font-weight: bold;',
        'color: black;',
        ...data
      );
    }
  },
  error: (origin: string, message: string, ...data: any[]) => {
    if (isLoggingEnabled) {
      console.error(
        `%c[${getTimestamp()}] %c${formatOrigin(origin)} %c${message}`,
        'color: gray',
        'color: red; font-weight: bold;',
        'color: black;',
        ...data
      );
    }
  },
};

// Global error handler for non-React errors
window.addEventListener('error', (event) => {
  logger.error('GlobalErrorHandler', 'Uncaught error detected!', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

window.addEventListener('unhandledrejection', (event) => {
    logger.error('GlobalPromiseRejection', 'Unhandled promise rejection detected!', {
        reason: event.reason
    });
});
