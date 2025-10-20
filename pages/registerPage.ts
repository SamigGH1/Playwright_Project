import {Page, Locator, expect} from '@playwright/test';
import { BasePage } from './basePage';

export class RegisterPage extends BasePage
{

    private readonly firstNameField: Locator = this.page.getByPlaceholder("First Name");
    private readonly lastNameField: Locator = this.page.getByPlaceholder("Last Name");
    private readonly emailField: Locator = this.page.getByPlaceholder("E-Mail");
    private readonly telephoneField: Locator = this.page.getByPlaceholder("Telephone");
    private readonly passwordField: Locator = this.page.locator('#input-password');
    private readonly confirmPasswordField: Locator = this.page.locator("#input-confirm");
    private readonly subscribeYesRadio: Locator = this.page.locator("#input-newsletter-yes")
    private readonly subscribeNoRadio: Locator = this.page.locator("#input-newsletter-no")
    private readonly privacyPolicyCheckbox: Locator = this.page.locator("#input-agree");
    private readonly continueButton: Locator = this.page.getByRole('button', { name: 'Continue' });
    private readonly continueLink: Locator = this.page.locator("//a[contains(@class, 'btn btn-primary') and text() = 'Continue']");

    public async enterFirstName (firstNameField: string): Promise<void>{
        await this.firstNameField.fill(firstNameField);
    }

    public async enterLastName (lastNameField: string): Promise<void>{
        await this.lastNameField.fill(lastNameField);
    }
    public async enterEmail (emailField: string): Promise<void>{
        await this.emailField.fill(emailField);
    }   

    public async enterTelephone (telephoneField: string): Promise<void>{
        await this.telephoneField.fill(telephoneField);
    }

    public async enterPassword (passwordField: string): Promise<void>{
        await this.passwordField.fill(passwordField);
    }   

    public async enterConfirmPassword (confirmPasswordField: string): Promise<void>{
        await this.confirmPasswordField.fill(confirmPasswordField);
    }

   public async selectSubscribeOption(subscribe: string): Promise<void> {
        if (subscribe.toLowerCase() === 'yes') {
            await this.subscribeYesRadio.check({ force: true });
        } 
        else {
            await this.subscribeNoRadio.check({ force: true });
        }
    }

    public async checkPrivacyPolicy(): Promise<void>{
        await this.privacyPolicyCheckbox.check({ force: true });
    }   

    public async clickContinueButton(): Promise<void>
    {
        await this.continueButton.click();
    }

    public async clickContinueLink(): Promise<void>
    {
        await this.continueLink.click();
    }

    public async register(firstName: string, lastName: string, email: string, telephone: string, password: string, subscribe: string): Promise<void>
    {
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterEmail(email);
        await this.enterTelephone(telephone);
        await this.enterPassword(password);
        await this.enterConfirmPassword(password);
        await this.selectSubscribeOption(subscribe);
        await this.checkPrivacyPolicy();
        await this.clickContinueButton();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('h1')).toHaveText('Your Account Has Been Created!');
        await this.clickContinueLink();
        await this.page.waitForLoadState('networkidle');
    }
}