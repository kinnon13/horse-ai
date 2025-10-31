// rate-limit.e2e.test.ts (30 lines) - Single responsibility: Rate limiting testing
import { test, expect } from '@playwright/test';

test.describe('Rate Limit Tests', () => {
  test('Rate limit triggers after 10 questions', async ({ page }: { page: any }) => {
    await page.goto('/');
    
    // Ask 10 questions to trigger rate limit
    for (let i = 0; i < 10; i++) {
      await page.fill('input[placeholder*="Ask"]', `Question ${i + 1}`);
      await page.press('input[placeholder*="Ask"]', 'Enter');
      await page.waitForTimeout(500);
    }
    
    // 11th question should trigger paywall
    await page.fill('input[placeholder*="Ask"]', 'Question 11');
    await page.press('input[placeholder*="Ask"]', 'Enter');
    await page.waitForTimeout(500);
    
    // Check for paywall or rate limit message
    const upgradeMsg = page.locator('text=Upgrade')
    const rateLimitMsg = page.locator('text=Rate limit')
    const upgradeVisible = await upgradeMsg.isVisible().catch(() => false)
    const rateLimitVisible = await rateLimitMsg.isVisible().catch(() => false)
    expect(upgradeVisible || rateLimitVisible).toBe(true)
  });
});


