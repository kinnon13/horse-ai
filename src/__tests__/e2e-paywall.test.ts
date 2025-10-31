// e2e-paywall.test.ts (25 lines) - Paywall and upgrade flow tests
import { test, expect } from '@playwright/test'

test.describe('HorseGPT Paywall', () => {
  test('Paywall appears after upgrade is needed', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    // Ask questions until paywall trigger
    for (let i = 1; i <= 11; i++) {
      await page.fill('input[placeholder*="Ask about your horse"]', `Question ${i}`)
      await page.click('button:has-text("Send")')
      await page.waitForTimeout(500)
    }
    
    // Verify upgrade prompt appears
    await expect(page.locator('text=Upgrade to Continue')).toBeVisible()
    await expect(page.locator('text=Upgrade to Pro - $19.99/month')).toBeVisible()
    
    // Click upgrade button and verify redirect
    await page.click('button:has-text("Upgrade to Pro")')
    await expect(page).toHaveURL('/pricing')
  })
})

