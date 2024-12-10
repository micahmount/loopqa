import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Read test cases from the JSON file
const testCasesPath = path.resolve(__dirname, '../data/testCases.json');
const testCases = JSON.parse(fs.readFileSync(testCasesPath, 'utf-8'));
const appURI = 'https://animated-gingersnap-8cf7f2.netlify.app/'
 
// Data-driven test
testCases.forEach(({ name, login, navigation, task, column = "To Do", tags }) => {
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
    const columnSelector = `#${column.toLowerCase().replace(' ', '-')}-column`; // Convert column to lower-case and replace spaces with hyphens
    const taskColumn = page.locator(columnSelector);
    await expect(taskColumn).toContainText(task);

    // Step 4: Verify the task tags
    const taskElement = todoColumn.locator(`text=${task}`);
    for (const tag of tags) {
      await expect(taskElement).toContainText(tag);
    }
  });
});
