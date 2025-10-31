import { test, expect } from '@playwright/test'

test.describe('HorseGPT Save Horse Modal', () => {
  test('Save horse modal appears and functions correctly', async ({ page }: { page: any }) => {
    await page.goto('/chat')
    
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('show-save-horse-modal', {
        detail: { name: 'Thunder', breed: 'Quarter Horse', age: 8 }
      }))
    })
    
    await expect(page.locator('[data-testid="save-horse-modal"]')).toBeVisible()
    
    await page.fill('[data-testid="horse-name-input"]', 'Thunder')
    
    await page.click('[data-testid="save-horse-button"]')
    
    await expect(page.locator('[data-testid="save-horse-modal"]')).not.toBeVisible()
  })
})

