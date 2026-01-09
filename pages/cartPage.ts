import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {

    public async getProductDetails(productName: string) {
        // Wait for the form containing the cart table
        const cartForm = this.page.locator('form[action*="checkout/cart/edit"]');
        await cartForm.waitFor({ state: 'visible', timeout: 5000 });

        // Locate the table specifically inside this form
        const rows = cartForm.locator('table.table tbody tr');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const productNameCell = row.locator('td').nth(1);
            const productNameText = (await productNameCell.innerText()).trim();

            if (productNameText.includes(productName)) {
                const cells = row.locator('td');

                return {
                    name: productNameCell,
                    model: await cells.nth(2).innerText(),
                    quantity: cells.nth(3).locator('input'),
                    unitPrice: await cells.nth(4).innerText(),
                    totalPrice: await cells.nth(5).innerText(),
                    updateQuantityButton: cells.nth(3).locator('button.btn-primary'),
                    removeButton: cells.nth(3).locator('button.btn-danger'),
                };
            }
        }

        throw new Error(`Product "${productName}" not found in cart`);
    }


    public async getProductQuantity(productName: string): Promise<number> {
        const details = await this.getProductDetails(productName);
        return parseInt(await details.quantity.inputValue());
    }

    public async setQuantity(productName: string, quantity: number) {
        const details = await this.getProductDetails(productName);
        await details.quantity.fill(String(quantity));
        await details.updateQuantityButton.click();
    }

    public async removeProduct(productName: string) {
        const details = await this.getProductDetails(productName);
        await details.removeButton.click();
    }

    public async getSummaryTotal() {
        // Locate the summary table container
        const summaryTable = this.page.locator('div.col-md-4 table.table');

        await summaryTable.waitFor({ state: 'visible', timeout: 5000 });

        // get value by label inside this table only
        const getValue = async (label: string) =>
            (await summaryTable
                .locator(`xpath=.//tr[td[normalize-space(.)="${label}"]]/td[2]`)
                .textContent())?.trim() ?? '';

        return {
            subTotal: await getValue('Sub-Total:'),
            ecoTax: await getValue('Eco Tax (-2.00):'),
            vat: await getValue('VAT (20%):'),
            total: await getValue('Total:'),
        };
    }
}
