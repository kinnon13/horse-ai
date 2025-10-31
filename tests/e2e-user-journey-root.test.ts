import { test, expect } from '@playwright/test'

test.describe('HorseGPT User Journey', () => {
  test('Complete journey: 10 Qs → Save → Paywall → Success', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    const questions = [
      'What should I feed my horse?',
      'How often should I exercise my horse?',
      'What are signs of colic?',
      'How to treat thrush?',
      'When to call the vet?',
      'Best saddle for trail riding?',
      'How to train a young horse?',
      'What vaccinations does my horse need?',
      'How to prevent laminitis?',
      'Best farrier in my area?'
    ]

    for (const question of questions) {
      await page.fill('[data-testid="chat-input"]', question)
      await page.click('[data-testid="send-button"]')
      await page.waitForSelector('[data-testid="ai-response"]')
    }

    await expect(page.locator('[data-testid="paywall-modal"]')).toBeVisible()
    
    await page.click('[data-testid="maybe-later-button"]')
    
    await page.fill('[data-testid="chat-input"]', 'Another question')
    await page.click('[data-testid="send-button"]')
    await expect(page.locator('[data-testid="paywall-modal"]')).toBeVisible()
    
    await page.click('[data-testid="upgrade-button"]')
    await expect(page).toHaveURL('/pricing')
    
    await expect(page.locator('h1')).toContainText('Pricing')
  })
})

