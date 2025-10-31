// save-horse.e2e.test.ts (30 lines) - Single responsibility: Save horse testing
import { test, expect } from '@playwright/test';

test.describe('Save Horse Tests', () => {
  test('Save horse modal appears and functions', async ({ page }: { page: any }) => {
    await page.goto('/');
    
    // Trigger save horse modal (after 10 questions)
    for (let i = 0; i < 10; i++) {
      await page.fill('input[placeholder*="Ask"]', `Question ${i + 1}`);
      await page.press('input[placeholder*="Ask"]', 'Enter');
      await page.waitForTimeout(500);
    }
    
    // Check for save horse modal
    await expect(page.locator('text=Save Your Horse Profile')).toBeVisible();
    
    // Fill in horse name and save
    await page.fill('input[placeholder*="Horse name"]', 'Test Horse');
    await page.click('button:has-text("Save Horse")');
    
    // Verify modal closes
    await expect(page.locator('text=Save Your Horse Profile')).not.toBeVisible();
  });
});


