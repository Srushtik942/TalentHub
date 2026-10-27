import {test, expect} from '@playwright/test';
import { getApplicantData } from './utils/testData';
import { fillApplicantForm, submitSignup } from './utils/signupHelpers';


test('Home page loads',async({page})=>{
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/Talenthub/);
});


test('Sign up page loads after clicking on the create account',async({page})=>{
    await page.goto('http://localhost:5173/');
    await page.getByTestId('create-account-btn').click();
    await expect(page).toHaveURL(/register/);
});

test('Sign up page loads after clicking on the hiring button',async({page})=>{
    await page.goto('http://localhost:5173/');
    await page.getByTestId('hiring-btn').click();
    await expect(page).toHaveURL(/register/);

});

test('Sign in page loads after clicking on the sign in button',async({page})=>{
    await page.goto('http://localhost:5173/');
    await page.getByTestId('signIn-btn').click();
    await expect(page).toHaveURL(/login/);
});

test('Applicant can register', async ({ page }) => {
    test.setTimeout(90000); // the default 30s test timeout is also too short for a cold start

    page.on('console', (msg) => console.log('BROWSER:', msg.text()));
    page.on('requestfailed', (req) =>
        console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText)
    );

    await page.goto('http://localhost:5173/');
    await page.getByTestId('hiring-btn').click();
    await expect(page).toHaveURL(/register/);

    await fillApplicantForm(page, getApplicantData());

    const [response] = await Promise.all([
        page.waitForResponse(
            (res) =>
                res.url().includes('/api/auth/register') &&
                res.request().method() === 'POST',
            { timeout: 60000 }
        ),
        submitSignup(page),
    ]);

    console.log('Register API :', response.status(), await response.text());
    expect(response.status()).toBe(201);
});