// e2e-chat.test.ts (30 lines) - Chat functionality tests
import { test, expect } from '@playwright/test'

test.describe('HorseGPT Chat', () => {
  test('Chat messages work correctly', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    // Verify chat UI loads
    await expect(page.locator('text=Ask me anything about YOUR horse')).toBeVisible()
    
    // Send a message
    await page.fill('input[placeholder*="Ask about your horse"]', 'How often should I exercise my horse?')
    await page.click('button:has-text("Send")')
    await page.waitForTimeout(500)
    
    // Verify response appears
    const response = await page.locator('[data-testid="assistant-message"]').first()
    await expect(response).toBeVisible()
  })
  
  test('Service directory functionality', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    // Click find services button
    await page.click('button:has-text("Find Services")')
    
    // Enter location and search
    await page.fill('input[placeholder*="Enter your location"]', 'Kentucky')
    await page.click('button:has-text("Find Services")')
    
    // Verify results appear
    await expect(page.locator('text=Veterinarians Near You')).toBeVisible()
  })
})

