import {test, expect} from '@playwright/test';


test('Home page loads',async({page})=>{
    await page.goto('/');
    await expect(page).toHaveTitle(/Talenthub/);
});


test('Sign up page loads after clicking on the create account',async({page})=>{
    await page.goto('/');
    await page.getByTestId('create-account-btn').click();
    await expect(page).toHaveURL(/register/);
});

test('Sign up page loads after clicking on the hiring button',async({page})=>{
    await page.goto('/');
    await page.getByTestId('hiring-btn').click();
    await expect(page).toHaveURL(/register/);

});

test('Sign in page loads after clicking on the sign in button',async({page})=>{
    await page.goto('/');
    await page.getByTestId('signIn-btn').click();
    await expect(page).toHaveURL(/login/);
});