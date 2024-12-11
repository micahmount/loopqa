import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Read test cases from the JSON file
const testCasesPath = path.resolve(__dirname, '../data/testCases.json');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
const appURI = 'https://animated-gingersnap-8cf7f2.netlify.app/'
 
// Data-driven test
testCases.forEach(({ name, login, navigation, task, column, tags }) => {
  test(name, async ({ page }) => {
    // Step 1: Login
    await page.goto(appURI);
    await page.fill('#username', login.username);
    await page.fill('#password', login.password);
    await page.getByRole('button', {name: 'Sign in'}).click();
    await expect(page.locator('h1.text-xl')).toContainText(navigation); // Confirm heading update

    // Step 2: Navigate to specific application

    await page.click(`nav >> text=${navigation}`); // Click the navigation button
    await expect(page.locator('h1.text-xl')).toContainText(navigation); // Confirm heading update

    // Locate the column within the main element
    const columnSelector = `main div:has-text("${column}")`;
    const columnLocator = page.locator(columnSelector);

    // Verify the column is visible
    await expect(columnLocator.first()).toBeVisible();

    // Step 3: Verify the desired task exists as a descendant of the designated column
    const taskLocator = columnLocator.locator(`div:has-text("${task}")`);

    await expect(taskLocator.first()).toBeVisible();

    // Step 4: Verify the task tags as descendants of the task
    for (const tag of tags) {
      const tagLocator = taskLocator.locator(`div:has-text("${tag}")`);
      await expect(tagLocator.first()).toBeVisible();
    }
  });
});
