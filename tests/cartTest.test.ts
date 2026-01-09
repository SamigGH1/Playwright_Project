import { test, expect } from '../fixtures/baseFixtures';
import { normaliseCurrency } from '../helpers/helpers';
import { ShopPage } from '../pages/shopPage';

test('Add and View Product in Cart', async ({ cartPage, shopPage }) => {

    //expected values
    const productName = 'Palm Treo Pro';
    const expectedPrice = '$337.99';
    const subTotal = '$279.99';
    const ecoTax = '$2.00';
    const vat = '$56.00';

    await shopPage.navigateToShopPage('Software');
    await shopPage.addItemToCart(productName);

    const notification = await shopPage.getCartNotificationDetails(productName);
    await expect(notification.fullText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    await shopPage.viewCartFromNotification();

    //verify product details in cart table
    const product = await cartPage.getProductDetails(productName);
    await expect(product.unitPrice).toBe(expectedPrice);
    await expect(product.totalPrice).toBe(expectedPrice);
    const qty = await product.quantity.inputValue();
    await expect(qty).toBe('1');

    //verify summary totals
    const summary = await cartPage.getSummaryTotal();
    await expect(summary.subTotal).toBe(subTotal);
    await expect(summary.ecoTax).toBe(ecoTax);
    await expect(summary.vat).toBe(vat);
    await expect(summary.total).toBe(expectedPrice);
});

test ('Add and View Multiple Products in Cart', async({cartPage, shopPage})=>{
    const productsToAdd = [
        {name: 'iPod Touch', price: '$194.00'},
        {name: 'HTC Touch HD', price: '$146.00'},
        {name: 'Nikon D300', price: '$98.00'},
        {name: 'Sony VAIO', price: '$1,202.00'},
    ]
    
    await shopPage.navigateToShopPage('Laptops & Notebooks');

    //verify adding products to cart
    let expectedCartTotal = 0;

    for (const product of productsToAdd) {
        await shopPage.addItemToCart(product.name);
        const notification = await shopPage.getCartNotificationDetails(product.name);

        expectedCartTotal += parseFloat(product.price.replace(/[$,]/g, ''));
        const actualPrice = notification.priceText.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})/g);
        const cartTotalFromNotification = actualPrice? parseFloat(actualPrice[actualPrice.length - 1].replace(/,/g, '')): 0;

        await expect(notification.fullText).toContain(`Success: You have added ${product.name} to your shopping cart!`);
        await expect(notification.productName).toBe(product.name);
        expect (cartTotalFromNotification.toFixed(2)).toBe(expectedCartTotal.toFixed(2));
    }

    await expect(shopPage.page.locator('.cart-item-total').first()).toHaveText('4');

    await shopPage.viewCartFromNotification();

    //verify each product in cart
    for (const product of productsToAdd) {
        const cartProduct = await cartPage.getProductDetails(product.name);
        await expect(cartProduct.unitPrice).toBe(product.price);
        await expect(cartProduct.totalPrice).toBe(product.price);
        const qty = await cartProduct.quantity.inputValue();
        await expect(qty).toBe('1');
    }

    const summary = await cartPage.getSummaryTotal();

    const expectedSubTotal = `$${((expectedCartTotal - (productsToAdd.length * 2)) / 1.20).toFixed(2)}`;
    const expectedEcoTax = `$${(productsToAdd.length * 2).toFixed(2)}`;
    const expectedVat = `$${(((expectedCartTotal - (productsToAdd.length * 2)) / 1.20) * 0.20).toFixed(2)}`;
    const expectedTotal = `$${expectedCartTotal.toFixed(2)}`;

    await expect(normaliseCurrency(summary.subTotal)).toBeCloseTo(normaliseCurrency(expectedSubTotal), 2);
    await expect(normaliseCurrency(summary.ecoTax)).toBeCloseTo(normaliseCurrency(expectedEcoTax), 2);
    await expect(normaliseCurrency(summary.vat)).toBeCloseTo(normaliseCurrency(expectedVat), 2);
    await expect(normaliseCurrency(summary.total)).toBeCloseTo(normaliseCurrency(expectedTotal), 2);

})

test ('Update Single Product Quanitity in Cart', async({cartPage, shopPage})=>{
    const productName = 'Sony VAIO';
    const productPrice = '$1,202.00';
    const subTotal = '$1,000.00';
    const ecoTax = '$2.00';
    const vat = '$200.00';

    await shopPage.navigateToShopPage('Laptops & Notebooks');
    await shopPage.addItemToCart(productName);
    await shopPage.viewCartFromNotification();

    //verify product details
    const product = await cartPage.getProductDetails(productName);
    await expect(product.unitPrice).toBe(productPrice);
    await expect(product.totalPrice).toBe(productPrice);
    await expect (await product.quantity.inputValue()).toBe('1');
    
    //verify summary totals
    const summary = await cartPage.getSummaryTotal();
    await expect(summary.subTotal).toBe(subTotal);
    await expect(summary.ecoTax).toBe(ecoTax);
    await expect(summary.vat).toBe(vat);
    await expect(summary.total).toBe(productPrice);

    //update quantity to 3
    await cartPage.setQuantity(productName, 3);

    //verify updated product details
    const newProductValues = await cartPage.getProductDetails(productName);
    await expect (await newProductValues.quantity.inputValue()).toBe('3');
    await expect(newProductValues.unitPrice).toBe(productPrice);
    await cartPage.page.waitForTimeout(300);
    await expect(normaliseCurrency(newProductValues.totalPrice)).toBe(normaliseCurrency(productPrice) * 3);

    //verify new summary totals
    const newSummary = await cartPage.getSummaryTotal();
    await expect(normaliseCurrency(newSummary.subTotal)).toBe(normaliseCurrency(subTotal) * 3);
    await expect(normaliseCurrency(newSummary.ecoTax)).toBe(normaliseCurrency(ecoTax) * 3);
    await expect(normaliseCurrency(newSummary.vat)).toBe(normaliseCurrency(vat) * 3);
    await expect(normaliseCurrency(newSummary.total)).toBe(normaliseCurrency(productPrice) * 3);
})

test ('Update Multiple Products Quantity in Cart', async({cartPage, shopPage})=>{
    const productsToAdd = [
        {name: 'iPod Touch', price: '$194.00'},
        {name: 'HTC Touch HD', price: '$146.00'},
    ]

    await shopPage.navigateToShopPage('Laptops & Notebooks');

    let expectedCartTotal = 0;

    for (const product of productsToAdd) {
        await shopPage.addItemToCart(product.name);
        const notification = await shopPage.getCartNotificationDetails(product.name);

        expectedCartTotal += parseFloat(product.price.replace(/[$,]/g, ''));
        const actualPrice = notification.priceText.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})/g);
        const cartTotalFromNotification = actualPrice? parseFloat(actualPrice[actualPrice.length - 1].replace(/,/g, '')): 0;

        await expect(notification.fullText).toContain(`Success: You have added ${product.name} to your shopping cart!`);
        await expect(notification.productName).toBe(product.name);
        expect (cartTotalFromNotification.toFixed(2)).toBe(expectedCartTotal.toFixed(2));
    }

    await expect(shopPage.page.locator('.cart-item-total').first()).toHaveText('2');

    await shopPage.viewCartFromNotification();

    for (const product of productsToAdd) {
        const cartProduct = await cartPage.getProductDetails(product.name);
        await expect(cartProduct.unitPrice).toBe(product.price);
        await expect(cartProduct.totalPrice).toBe(product.price);
        const qty = await cartProduct.quantity.inputValue();
        await expect(qty).toBe('1');
    }

    const summary = await cartPage.getSummaryTotal();

    const expectedSubTotal = `$${((expectedCartTotal - (productsToAdd.length * 2)) / 1.20).toFixed(2)}`;
    const expectedEcoTax = `$${(productsToAdd.length * 2).toFixed(2)}`;
    const expectedVat = `$${(((expectedCartTotal - (productsToAdd.length * 2)) / 1.20) * 0.20).toFixed(2)}`;
    const expectedTotal = `$${expectedCartTotal.toFixed(2)}`;

    await expect(normaliseCurrency(summary.subTotal)).toBe(normaliseCurrency(expectedSubTotal));
    await expect(normaliseCurrency(summary.ecoTax)).toBe(normaliseCurrency(expectedEcoTax));
    await expect(normaliseCurrency(summary.vat)).toBe(normaliseCurrency(expectedVat));
    await expect(normaliseCurrency(summary.total)).toBe(normaliseCurrency(expectedTotal));

    //update quantity to 2 for each product
    for (const product of productsToAdd) {
        await cartPage.setQuantity(product.name, 2);
    }

    //verify updated product details and new summary totals
    const totalItemCount = productsToAdd.length * 2; // qty = 2
    const ecoTaxTotal = totalItemCount * 2;
    let newExpectedCartTotal = 0;

    for (const product of productsToAdd) {
        const newProductValues = await cartPage.getProductDetails(product.name);
        await expect (await newProductValues.quantity.inputValue()).toBe('2');
        await expect(newProductValues.unitPrice).toBe(product.price);
        await cartPage.page.waitForTimeout(300);
        const productTotal = normaliseCurrency(product.price) * 2;
        newExpectedCartTotal += productTotal;
        await expect(normaliseCurrency(newProductValues.totalPrice)).toBe(productTotal);
    }

    const newSummary = await cartPage.getSummaryTotal();
    const newExpectedSubTotal = `$${((newExpectedCartTotal - ecoTaxTotal) / 1.20).toFixed(2)}`;
    const newExpectedEcoTax = `$${ecoTaxTotal.toFixed(2)}`;
    const newExpectedVat = `$${(((newExpectedCartTotal - ecoTaxTotal) / 1.20) * 0.20).toFixed(2)}`;
    const newExpectedTotal = `$${newExpectedCartTotal.toFixed(2)}`;

    await expect(normaliseCurrency(newSummary.subTotal)).toBe(normaliseCurrency(newExpectedSubTotal));
    await expect(normaliseCurrency(newSummary.ecoTax)).toBe(normaliseCurrency(newExpectedEcoTax));
    await expect(normaliseCurrency(newSummary.vat)).toBe(normaliseCurrency(newExpectedVat));
    await expect(normaliseCurrency(newSummary.total)).toBe(normaliseCurrency(newExpectedTotal));

})

test ('Remove Single Product from Cart', async({shopPage, cartPage})=>{
    //expected values
    const productName = 'Palm Treo Pro';
    const expectedPrice = '$337.99';
    const subTotal = '$279.99';
    const ecoTax = '$2.00';
    const vat = '$56.00';

    await shopPage.navigateToShopPage('Laptops & Notebooks');
    await shopPage.addItemToCart(productName);
    
    await shopPage.viewCartFromNotification();

    const product = await cartPage.getProductDetails(productName);
    await expect(product.unitPrice).toBe(expectedPrice);
    await expect(product.totalPrice).toBe(expectedPrice);
    await expect (await product.quantity.inputValue()).toBe('1');
    
    //verify summary totals
    const summary = await cartPage.getSummaryTotal();
    await expect(summary.subTotal).toBe(subTotal);
    await expect(summary.ecoTax).toBe(ecoTax);
    await expect(summary.vat).toBe(vat);
    await expect(summary.total).toBe(expectedPrice);

    //remove product from cart
    await cartPage.removeProduct(productName);
    await cartPage.page.waitForTimeout(500);
    await expect(cartPage.page.locator('p', { hasText: 'Your shopping cart is empty!' }).first()).toBeVisible();
    await expect(cartPage.page.locator('.cart-item-total').first()).toHaveText('0');
})

test('Remove Multiple Products from Cart', async({cartPage, shopPage})=>{
    const productsToAdd = [
        {name: 'iPod Touch', price: '$194.00'},
        {name: 'HTC Touch HD', price: '$146.00'},
        {name: 'Nikon D300', price: '$98.00'},
        {name: 'Sony VAIO', price: '$1,202.00'},
    ]
    
    await shopPage.navigateToShopPage('Laptops & Notebooks');

    //verify adding products to cart
    let expectedCartTotal = 0;

    for (const product of productsToAdd) {
        await shopPage.addItemToCart(product.name);
        const notification = await shopPage.getCartNotificationDetails(product.name);

        expectedCartTotal += parseFloat(product.price.replace(/[$,]/g, ''));
        const actualPrice = notification.priceText.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})/g);
        const cartTotalFromNotification = actualPrice? parseFloat(actualPrice[actualPrice.length - 1].replace(/,/g, '')): 0;

        await expect(notification.fullText).toContain(`Success: You have added ${product.name} to your shopping cart!`);
        await expect(notification.productName).toBe(product.name);
        expect (cartTotalFromNotification.toFixed(2)).toBe(expectedCartTotal.toFixed(2));
    }

    await expect(shopPage.page.locator('.cart-item-total').first()).toHaveText('4');

    await shopPage.viewCartFromNotification();

    //verify each product in cart
    for (const product of productsToAdd) {
        const cartProduct = await cartPage.getProductDetails(product.name);
        await expect(cartProduct.unitPrice).toBe(product.price);
        await expect(cartProduct.totalPrice).toBe(product.price);
        const qty = await cartProduct.quantity.inputValue();
        await expect(qty).toBe('1');
    }

    const summary = await cartPage.getSummaryTotal();

    const expectedSubTotal = `$${((expectedCartTotal - (productsToAdd.length * 2)) / 1.20).toFixed(2)}`;
    const expectedEcoTax = `$${(productsToAdd.length * 2).toFixed(2)}`;
    const expectedVat = `$${(((expectedCartTotal - (productsToAdd.length * 2)) / 1.20) * 0.20).toFixed(2)}`;
    const expectedTotal = `$${expectedCartTotal.toFixed(2)}`;

    await expect(normaliseCurrency(summary.subTotal)).toBeCloseTo(normaliseCurrency(expectedSubTotal), 2);
    await expect(normaliseCurrency(summary.ecoTax)).toBeCloseTo(normaliseCurrency(expectedEcoTax), 2);
    await expect(normaliseCurrency(summary.vat)).toBeCloseTo(normaliseCurrency(expectedVat), 2);
    await expect(normaliseCurrency(summary.total)).toBeCloseTo(normaliseCurrency(expectedTotal), 2);

    //remove each product from cart
    for (const product of productsToAdd) {
        await cartPage.removeProduct(product.name);
        await cartPage.page.waitForTimeout(500);
    }
    await expect(cartPage.page.locator('p', { hasText: 'Your shopping cart is empty!' }).first()).toBeVisible();
    await expect(cartPage.page.locator('.cart-item-total').first()).toHaveText('0');
})
