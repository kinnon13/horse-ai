// errorHandler.ts - Universal async error wrapper
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    console.error('Async error:', error)
    return fallback
  }
}

export function wrapAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<R | null> {
  return async (...args: T) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error)
      return null
    }
  }
}

