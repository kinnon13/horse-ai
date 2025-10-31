// chat-flow.e2e.test.ts (35 lines) - Single responsibility: Main chat flow tests
import { test, expect } from '@playwright/test'

test.describe('HorseGPT Chat Flow', () => {
  test('Complete user journey: 10 questions → Save → Paywall → Success', async ({ page }: { page: any }) => {
    // Navigate to chat page
    await page.goto('/chat')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="chat-input"]')
    
    // Test 10 questions (rate limit)
    for (let i = 1; i <= 10; i++) {
      await page.fill('[data-testid="chat-input"]', `Test question ${i} about my horse`)
      await page.click('[data-testid="send-button"]')
      
      // Wait for response
      await page.waitForSelector('[data-testid="assistant-message"]', { timeout: 10000 })
      
      // Check remaining questions counter
      const remaining = await page.textContent('[data-testid="remaining-questions"]')
      expect(remaining).toBe(`${10 - i} questions left`)
    }
    
    // 11th question should trigger paywall
    await page.fill('[data-testid="chat-input"]', 'This should trigger paywall')
    await page.click('[data-testid="send-button"]')
    
    // Check paywall modal appears
    await page.waitForSelector('[data-testid="paywall-modal"]')
    expect(await page.textContent('[data-testid="paywall-title"]')).toContain('reached your limit')
  })
})
