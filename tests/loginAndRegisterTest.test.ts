import { test, expect } from '../fixtures/baseFixtures';
import { generateRandomUserDetails } from '../helpers/helpers';

test('Register New User', async({setupMyAccountPage})=>{
  await expect(setupMyAccountPage.page).toHaveTitle('My Account')
  await setupMyAccountPage.logout();
})

test('Login to Existing Account', async ({ loggedInPage }) => {
  await expect(loggedInPage.page).toHaveTitle('My Account');
  await loggedInPage.logout();
});

test('Change Account Details', async ({ setupMyAccountPage, testUser }) => {
  const updatedDetails = generateRandomUserDetails();
  const editPage = await setupMyAccountPage.navigateToEditYourAccountInformationPage();

  await editPage.editAccountDetails(updatedDetails.firstName, updatedDetails.lastName, updatedDetails.email, updatedDetails.phone);
  await expect(editPage.page.locator('.alert-success')).toHaveText(/Success: Your account has been successfully updated./);

  await editPage.navigateToEditYourAccountInformationPage();
  await editPage.checkNewAccountDetails(updatedDetails.firstName, updatedDetails.lastName, updatedDetails.email, updatedDetails.phone);
  await editPage.logout();

  await editPage.navigateToMyAccountPage();
  await editPage.login(updatedDetails.email, testUser.password);
  await expect(editPage.page).toHaveTitle('My Account');
  await editPage.logout();
});

test('Change Password', async ({setupMyAccountPage, testUser})=>{
  const newPassword = generateRandomUserDetails();
  const changePasswordPage = await setupMyAccountPage.navigateToChangeYourPasswordPage(newPassword.password, newPassword.password);
  await expect(changePasswordPage.page.locator('.alert-success')).toHaveText(/Success: Your password has been successfully updated./);

  await changePasswordPage.logout();
  await changePasswordPage.navigateToMyAccountPage();
  await changePasswordPage.login(testUser.email, newPassword.password);
  await expect(changePasswordPage.page).toHaveTitle('My Account');
  await changePasswordPage.logout();
})
