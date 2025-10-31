import { test, expect } from '@playwright/test'

test.describe('HorseGPT User Journey', () => {
  test('Complete journey: 10 Qs → Save → Paywall → Success', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    await expect(page.locator('text=Ask me anything about YOUR horse')).toBeVisible()
    
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder*="question"]', `Test question ${i} about my horse`)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(1000)
    }
    
    await expect(page.locator('text=Save Your Horse Profile')).toBeVisible()
    
    await page.fill('input[placeholder="Horse name"]', 'Thunder')
    await page.click('button:has-text("Save Horse")')
    
    await expect(page.locator('text=Upgrade to HorseGPT Pro')).toBeVisible()
    
    await page.click('button:has-text("Upgrade Now")')
    
    await expect(page).toHaveURL(/stripe/)
    
    await expect(page.locator('text=Payment successful')).toBeVisible()
  })
})

