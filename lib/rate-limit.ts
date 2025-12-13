// Simple in-memory rate limiter
// Note: In serverless, each instance has its own memory, so this is per-instance limiting.
// For strict global limiting, use Redis/Upstash. This is sufficient for basic protection.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute per key

export function rateLimit(key: string): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  // Clean up expired entry
  if (entry && now > entry.resetAt) {
    store.delete(key)
  }

  const current = store.get(key)

  if (!current) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true, remaining: MAX_REQUESTS - 1 }
  }

  if (current.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 }
  }

  current.count++
  return { success: true, remaining: MAX_REQUESTS - current.count }
}

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 60 * 1000)
