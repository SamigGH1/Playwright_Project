import { generateRandomUserDetails } from '../helpers/helpers';
import { MyAccountPage } from '../pages/myAccountPage';
import { RegisterPage } from '../pages/registerPage';
import { ShopPage } from '../pages/shopPage';
import { test as baseTest, expect as baseExpect } from '@playwright/test';

const test = baseTest.extend<{
  myAccountPage: MyAccountPage;
  registerPage: RegisterPage;
  setupMyAccountPage: MyAccountPage;
  loggedInPage: MyAccountPage;
  shopPage: ShopPage;
  testUser: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    subscribe: string;
  };
}>({
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  shopPage: async ({page}, use) =>{
    await page.goto('');
    await use (new ShopPage (page));
  },

  testUser: async ({}, use) => {
    const userDetails = generateRandomUserDetails();
    await use(userDetails);
  },

  setupMyAccountPage: async ({ page, registerPage, testUser, myAccountPage }, use) => {
    await page.goto('');
    await registerPage.navigateToMyAccountPage();
    await myAccountPage.continueToRegisterationPage();
    await registerPage.register(
      testUser.firstName,
      testUser.lastName,
      testUser.email,
      testUser.phone,
      testUser.password,
      testUser.subscribe
    );
    await use(new MyAccountPage(page));
  },

  loggedInPage: async ({ setupMyAccountPage, page, testUser }, use) => {
    // Use setupMyAccountPage fixture sequentially
    await setupMyAccountPage.logout();
    await setupMyAccountPage.navigateToMyAccountPage();
    await setupMyAccountPage.login(testUser.email, testUser.password);
    await use(new MyAccountPage(page));
  },
});

export { test, baseExpect as expect };
