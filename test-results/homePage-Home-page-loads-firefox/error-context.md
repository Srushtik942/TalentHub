# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homePage.spec.js >> Home page loads
- Location: tests\homePage.spec.js:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1 | import {test, expect} from '@playwright/test';
  2 | 
  3 | 
  4 | test('Home page loads',async({page})=>{
> 5 |     await page.goto('/');
    |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  6 |     await expect(page).toHaveTitle(/Talenthub/);
  7 | });
  8 | 
  9 | 
```