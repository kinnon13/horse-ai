import { test, expect } from '@playwright/test'

test.describe('HorseGPT Service Directory', () => {
  test('Service directory search works', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    await page.fill('input[placeholder*="Service type"]', 'vet')
    await page.fill('input[placeholder*="City"]', 'Austin')
    await page.click('button:has-text("Search")')
    
    await expect(page.locator('.service-result')).toBeVisible()
  })
})

