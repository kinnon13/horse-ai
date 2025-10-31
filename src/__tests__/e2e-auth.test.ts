// e2e-auth.test.ts (35 lines) - Authentication and save horse flow tests
import { test, expect } from '@playwright/test'

test.describe('HorseGPT Auth Flow', () => {
  test('Save horse modal appears after 10 questions', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    // Verify hero message appears
    await expect(page.locator('text=Ask me anything about YOUR horse')).toBeVisible()
    
    // Ask 10 questions to trigger save horse modal
    for (let i = 1; i <= 10; i++) {
      await page.fill('input[placeholder*="Ask about your horse"]', `Question ${i}: What should I feed my horse?`)
      await page.click('button:has-text("Send")')
      await page.waitForTimeout(500) // Wait for response
    }
    
    // Verify save horse modal appears
    await expect(page.locator('text=Save Your Horse to Continue')).toBeVisible()
    
    // Fill out horse details
    await page.click('button:has-text("Save My Horse")')
    await page.fill('input[placeholder="Horse name"]', 'Thunder')
    await page.click('button:has-text("Save Horse")')
    
    // Verify success message
    await expect(page.locator('text=Horse saved successfully')).toBeVisible()
  })
})

