import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Read test cases from the JSON file
const testCasesPath = path.resolve(__dirname, '../data/testCases.json');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
const appURI = 'https://animated-gingersnap-8cf7f2.netlify.app/'
 
// Data-driven test
testCases.forEach(({ name, board, task, column, tags }) => {
  const account = {username:"admin", password:"password123"};
  test(name, async ({ page }) => {
    // Step 1: Login
    await page.goto(appURI);
    await page.fill('#username', account.username);
    await page.fill('#password', account.password);
    await page.getByRole('button', {name: 'Sign in'}).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible(); // Confirm that we're logging into the app by looking for the Projects heading.

    // Step 2: Navigate to specific application
    await page.getByRole('button', {name: board }).click();

    // Step 3: Verify the desired task exists as a descendant of the designated column
    const columnLocator = page.getByText(column);
    await expect (columnLocator).toBeVisible();

    const taskLocator = columnLocator.getByText(task);
    await expect(taskLocator).toBeVisible();


    // Step 4: Verify the task tags as descendants of the task
    for (const tag of tags) {
      const taskCard = page.locator(`div:has-text("${task}")`).first();
      // Look for tags in the specific div structure: card > flex container > tag span
      await expect(taskCard.locator('div.flex.flex-wrap > span', { hasText: tag }).first()).toBeVisible();
    }
  });
});
