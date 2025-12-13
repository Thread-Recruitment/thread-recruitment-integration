import { describe, it, expect, beforeEach, vi } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('allows first request', () => {
    const result = rateLimit('test-ip-1')
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(59)
  })

  it('counts down remaining requests', () => {
    const key = 'test-ip-2'

    const first = rateLimit(key)
    expect(first.remaining).toBe(59)

    const second = rateLimit(key)
    expect(second.remaining).toBe(58)

    const third = rateLimit(key)
    expect(third.remaining).toBe(57)
  })

  it('blocks after 60 requests', () => {
    const key = 'test-ip-3'

    // Make 60 requests
    for (let i = 0; i < 60; i++) {
      const result = rateLimit(key)
      expect(result.success).toBe(true)
    }

    // 61st request should be blocked
    const blocked = rateLimit(key)
    expect(blocked.success).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('resets after window expires', () => {
    const key = 'test-ip-4'

    // Make some requests
    rateLimit(key)
    rateLimit(key)
    rateLimit(key)

    // Advance time past the window (60 seconds)
    vi.advanceTimersByTime(61 * 1000)

    // Should reset
    const result = rateLimit(key)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(59)
  })

  it('tracks different keys independently', () => {
    const result1 = rateLimit('ip-a')
    const result2 = rateLimit('ip-b')

    expect(result1.remaining).toBe(59)
    expect(result2.remaining).toBe(59)
  })
})
