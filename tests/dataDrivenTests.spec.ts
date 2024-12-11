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

    // Step 3: Verify the task exists in the specified column
    // Locate the column dynamically based on its text content within the main element
    const columnSelector = `main div:has-text("${column}")`; // Ensure the column is a child of "main"
    const columnLocator = page.locator(columnSelector);

    await expect(columnLocator).toBeVisible(); // Verify the column is visible

    // Locate the task as a descendant of the column
    const taskSelector = `div:has-text("${task}")`; // Selector for the task
    const taskLocator = columnLocator.locator(taskSelector);

    await expect(taskLocator).toBeVisible(); // Verify the task is visible within the column

    // Step 4: Verify the task tags
    for (const tag of tags) {
      const tagSelector = `div:has-text("${tag}")`; // Selector for each tag
      const tagLocator = taskLocator.locator(tagSelector);

      await expect(tagLocator).toBeVisible(); // Verify each tag is visible within the task
    }

  });
});
