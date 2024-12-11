# README

## Introduction: Overview of the task

The task focuses on verifying the hierarchical relationships between elements in a web application’s interface using Playwright. Specifically, the aim is to ensure that a specific project is selected, and then that a “Task” element exists and is correctly nested as a descendant of a “Column” element, and check to see if there are any “Tag” element(s) and if so that they are further nested as a descendant of the “Task” element. These verifications ensure the structural integrity and alignment with the expected design and functionality of the application.

## Implementation Details: Explanation of the solution and its main components

1. **Locators**:

   - Used Playwright's `locator()` API to target specific elements based on their text content and structure.
   - Scoped child locators to their parent locators using the `.locator()` method.

2. **Assertions**:

   - Leveraged Playwright’s `expect(locator).toBeVisible()` to confirm visibility and existence of the target elements.
   - Used `locator.has()` and `locator.hasText()` to explicitly verify parent-child relationships.

3. **Iterative Validation**:

   - Tested locators incrementally to ensure they correctly target the desired elements.
   - Introduced debugging steps like `first()` to identify potential mismatches or ambiguities in the DOM.

4. **Code Snippets**:

   ```javascript
   // Locate the column containing "To Do"
   const columnLocator = page.locator('div:has-text("To Do")');

   // Verify the task is a descendant of the column
   const taskLocator = columnLocator.locator('div:has-text("Implement user authentication")');
   await expect(taskLocator).toBeVisible();

   // Verify the tag is a descendant of the task
   const tagLocator = taskLocator.locator('span:has-text("Feature")');
   await expect(tagLocator).toBeVisible();
   ```

## Challenges and Solutions: Any obstacles and how they were addressed

### Challenge 1: Locators matching multiple elements

- **Problem**: Using `locator('main div:has-text("To Do")')` resolved to multiple elements due to overlapping criteria.
- **Solution**: Refined selectors to ensure specificity, such as targeting parent-child relationships explicitly.

### Challenge 2: Nested element verification

- **Problem**: Ensuring tasks and tags were verified as descendants, not just siblings.
- **Solution**: Scoped locators using `.locator()` on parent elements and verified hierarchy with assertions like `.toHaveSelector()`.

### Challenge 3: Ambiguities in structure

- **Problem**: Differences in DOM structure between environments led to inconsistent results.
- **Solution**: Used debugging methods like `.first()` to identify mismatched elements and refined selectors.

## Results: Summary of test run outcomes, noting any failures

- **Successes**:
  - Tasks were successfully verified as descendants of their respective columns.
  - Tags were correctly identified as descendants of their respective tasks.
- **Failures**:
  - Initial locator definitions matched unintended elements, causing assertion failures.
  - Resolved through iterative testing and selector refinement.

## Recommendations: Suggestions for improvements to the features or the testing process

1. **Selector Robustness**:

   - Use data attributes (e.g., `data-test-id`) for consistent element targeting to avoid reliance on text content.

2. **Test Scenarios**:

   - Expand test coverage to include edge cases, such as tasks with no tags or columns with no tasks.

3. **Debugging Enhancements**:

   - Incorporate logging for failed selectors to pinpoint issues quickly.

4. **Automation Maintenance**:

   - Periodically review and update selectors to adapt to changes in the application’s DOM structure.

5. **Performance Optimization**:

   - Optimize tests by minimizing redundant assertions and focusing on critical validations.
