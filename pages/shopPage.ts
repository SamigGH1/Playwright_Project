import {Page, Locator, expect} from '@playwright/test';
import { BasePage } from './basePage';
import { CartPage } from './cartPage';

export class ShopPage extends BasePage{
    private readonly productTile: Locator = this.page.locator(".product-layout");
    private readonly notificationBox: Locator = this.page.locator('#notification-box-top .toast-body');
    private readonly notificationHeader: Locator = this.page.locator('#notification-box-top .toast-header span');
    private readonly notificationViewCartButton: Locator = this.page.locator('//a[normalize-space(.)="View Cart"]');

    public async addItemToCart(productName: string): Promise<ShopPage> {
        await this.page.waitForLoadState('networkidle');

        //tackles notification box if it is present
        if (await this.notificationBox.isVisible()) {
            const closeBtn = this.page.locator('#notification-box-top .toast button[aria-label="Close"], #notification-box-top .toast button.close').first();
            await closeBtn.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(100);
            await closeBtn.locator('span').first().click({ force: true }).catch(() => {});
            await this.notificationBox.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
        }
        
        const product = this.page.locator('.product-layout', { hasText: productName }).first();
        await product.scrollIntoViewIfNeeded();
        await product.locator('.image').first().hover();

        const cartBtn = product.locator('button.btn-cart').first();

        try {
            await cartBtn.click();
        } catch {
            await product.scrollIntoViewIfNeeded();
            await product.locator('.image').first().hover();
            await cartBtn.click({ force: true });
        }

        return new ShopPage(this.page);
    }

    public async getCartNotificationDetails(expectedProductName: string) {
        await this.notificationBox.waitFor({ state: 'visible', timeout: 5000 });

        const productNameRaw = await this.notificationBox.locator('p a').first().textContent();
        const priceTextRaw = await this.notificationHeader.first().textContent();
        const fullTextRaw = await this.notificationBox.textContent();

        // remove $ signs and trim whitespace
        const fullText = fullTextRaw?.trim() || '';
        const productName = productNameRaw?.trim() || '';
        const priceText = priceTextRaw?.trim() || '';

        return {
            fullText,
            productName,
            priceText,
        };
    }

    public async viewCartFromNotification(): Promise<CartPage> {
        await this.notificationBox.waitFor({ state: 'visible', timeout: 5000 });
        await this.notificationViewCartButton.click();
        return new CartPage(this.page);
    }
}