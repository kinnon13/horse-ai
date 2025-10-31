import { test, expect } from '@playwright/test'

test.describe('HorseGPT Save Modal', () => {
  test('Save horse modal and service directory', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    for (let i = 1; i <= 5; i++) {
      await page.fill('[data-testid="chat-input"]', `Question ${i}`)
      await page.click('[data-testid="send-button"]')
      await page.waitForSelector('[data-testid="assistant-message"]')
    }
    
    await page.waitForSelector('[data-testid="save-horse-modal"]')
    await page.fill('[data-testid="horse-name-input"]', 'Thunder')
    await page.click('[data-testid="save-horse-button"]')
    
    await page.waitForSelector('[data-testid="save-horse-modal"]', { state: 'hidden' })
    
    await page.goto('/services')
    await page.fill('[data-testid="location-input"]', 'Lexington, KY')
    await page.click('[data-testid="search-services"]')
    
    await page.waitForSelector('[data-testid="vet-results"]')
    await page.waitForSelector('[data-testid="service-results"]')
  })
})

