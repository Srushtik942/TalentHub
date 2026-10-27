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

test('Applicant can register',async({page})=>{
    await page.goto('http://localhost:5173/');
    await page.getByTestId('hiring-btn').click();
    await expect(page).toHaveURL(/register/);

    const data = getApplicantData();
    await fillApplicantForm(page,data);

    const [response] = await Promise.all([
        page.waitForResponse((res)=> res.url().includes('/api/auth/register') && res.status() === 201 && res.request().method() === 'POST',
       {timeout: 20000}
    ) ,
    submitSignup(page),
    ]);

    console.log("Register API :", response.status(),await response.text());

    expect(response.status()).toBe(201);

});