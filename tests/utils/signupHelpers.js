export async function fillApplicantForm(page, data) {
  await page.getByTestId("name-field").fill(data.fullName);
  await page.getByTestId("email-address").fill(data.email);
  await page.getByTestId("password-field").fill(data.password);
  await page.getByTestId("confirm-password").fill(data.confirmPassword);
  await page.getByTestId("signup-experience").selectOption(data.experience);
  await page.getByTestId("location-field").fill(data.location);
  await page.getByTestId("skills-files").fill(data.skills);

  await page.getByTestId("agreement-field").check();
}

export async function submitSignup(page) {
  await page.getByTestId("create-Btn").click();
}