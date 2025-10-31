import { test, expect } from '@playwright/test'

test.describe('HorseGPT Mobile UI', () => {
  test('Mobile responsive design', async ({ page }: { page: any }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/chat')
    
    await page.waitForSelector('[data-testid="mobile-chat-container"]')
    expect(await page.isVisible('[data-testid="mobile-header"]')).toBe(true)
    expect(await page.isVisible('[data-testid="mobile-input"]')).toBe(true)
  })
})

