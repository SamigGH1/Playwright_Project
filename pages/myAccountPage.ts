import {Page, Locator, expect} from '@playwright/test';
import { BasePage } from './basePage';
import { RegisterPage } from './registerPage';

export class MyAccountPage extends BasePage{
    
    //login box
    private readonly emailField: Locator = this.page.getByPlaceholder("E-Mail Address");
    private readonly passwordField: Locator = this.page.locator("//input[@placeholder = 'Password']")
    private readonly loginButton: Locator = this.page.locator("//input[@value = 'Login']");
    private readonly forgotPasswordLink: Locator = this.page.getByRole('link', { name: 'Forgotten Password' });
    private readonly continueLink: Locator = this.page.locator("//a[contains(@class, 'btn btn-primary') and text() = 'Continue']");

    //sidebar links
    private readonly myAccountLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()=' My Account')]");
    private readonly editAccountLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and contains(.,' Edit Account')]");
    private readonly passwordLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and contains(.,' Password')]");
    private readonly addressBookLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Address Book')]");
    private readonly wishListLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Wish List')]");
    private readonly notificationLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Notifcation')]");
    private readonly orderHistoryLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Order History')]");
    private readonly downloadsLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Downloads')]");
    private readonly recurringPaymentsLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Recurring payments')]");
    private readonly rewardPointsLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Reward Points')]");
    private readonly returnLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Returns')]");
    private readonly transactionsLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Transactions')]");
    private readonly newslettersLink: Locator = this.page.locator("//a[contains(@class, 'list-group-item') and(text()='Newsletters')]");
    private readonly logOutLink: Locator = this.page.getByRole('link', { name: /logout/i });

    //edit account details
    private readonly editFirstNameField: Locator = this.page.getByPlaceholder("First Name");
    private readonly editLastNameField: Locator = this.page.getByPlaceholder("Last Name");
    private readonly editEmailField: Locator = this.page.getByPlaceholder("E-Mail");
    private readonly confirmPasswordField: Locator = this.page.getByPlaceholder("Password Confirm");
    private readonly editTelephoneField: Locator = this.page.getByPlaceholder("Telephone");
    private readonly updateButton: Locator = this.page.locator("//input[@value = 'Continue']");
    private readonly backButton: Locator = this.page.locator("//a[contains(@class, 'btn btn-secondary') and contains(.,'Back')]");

    public async enterEmail(email: string): Promise<void> {
        await this.emailField.fill(email);
    }
    public async enterPassword(password: string): Promise<void>
    {
        await this.passwordField.fill(password);
    }
    public async enterConfirmPassword(password: string): Promise<void>{
        await this.confirmPasswordField.fill(password);
    }
    public async clickLoginButton(): Promise<void>
    {
        await this.loginButton.click();
    }

    public async login(email: string, password: string): Promise<MyAccountPage>
    {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginButton();
        return new MyAccountPage(this.page);
    }
    
    public async continueToRegisterationPage(): Promise<RegisterPage> {
        await this.continueLink.click();
        return new RegisterPage(this.page);
    }

    public async navigateToEditYourAccountInformationPage(): Promise<MyAccountPage> {
        await this.editAccountLink.click();
        return new MyAccountPage(this.page);
    }

    public async navigateToChangeYourPasswordPage(password: string, confirmPassword: string): Promise<MyAccountPage>{
        await this.passwordLink.click();
        await this.page.waitForLoadState('networkidle');
        
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword);
        await this.updateButton.click();

        return new MyAccountPage(this.page);
    }

    public async logout(): Promise<void> {
        await this.logOutLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.logOutLink.click();
        await this.continueLink.waitFor({ state: 'visible', timeout: 5000 });
        await this.continueLink.click();
    }

    public async editAccountDetails(firstName: string, lastName: string, email: string, telephone: string): Promise<MyAccountPage>
    {
        await this.editFirstNameField.fill(firstName);
        await this.editLastNameField.fill(lastName);
        await this.editEmailField.fill(email);
        await this.editTelephoneField.fill(telephone);
        await this.updateButton.click();

        return new MyAccountPage(this.page);
    }

    public async checkNewAccountDetails(firstName: string, lastName: string, email: string, telephone: string): Promise<MyAccountPage>
    {
        await expect(this.editFirstNameField).toHaveValue(firstName);
        await expect(this.editLastNameField).toHaveValue(lastName);
        await expect(this.editEmailField).toHaveValue(email);
        await expect(this.editTelephoneField).toHaveValue(telephone);
        await this.backButton.click();

        return new MyAccountPage(this.page);
    }
}