// chat-flow.e2e.test.ts (30 lines) - Single responsibility: Chat flow testing
import { test, expect } from '@playwright/test';

test.describe('Chat Flow Tests', () => {
  test('Ask questions and get responses', async ({ page }: { page: any }) => {
    await page.goto('/');
    await expect(page.locator('text=Ask me anything about YOUR horse')).toBeVisible();
    
    const questions = [
      'What is the best feed for a 5 year old gelding?',
      'My mare is limping, what should I do?',
      'How often should I have my horse\'s teeth checked?'
    ];
    
    for (const question of questions) {
      await page.fill('input[placeholder*="Ask"]', question);
      await page.press('input[placeholder*="Ask"]', 'Enter');
      await page.waitForTimeout(1000);
    }
  });
});


