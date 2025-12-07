import {test, expect} from '../fixtures/baseFixtures'; 

test('Add Product to Cart', async({shopPage})=>{
    const productName = 'HTC Touch HD';
    const expectedPrice = '$146.00';

    await shopPage.navigateToShopPage('Laptops & Notebooks');
    await shopPage.addItemToCart(productName);
    
    const notification = await shopPage.getCartNotificationDetails(productName);
    await expect(notification.fullText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    await expect(notification.productName).toBe(productName);
    await expect(notification.priceText).toContain(expectedPrice);
})

test ('Add Multiple Products to Cart', async({shopPage})=>{
    const productsToAdd = [
        {name: 'iPhone', price: '$123.20'},
        {name: 'iMac', price: '$170.00'},
        {name: 'Samsung SyncMaster 941BW', price: '$242.00'}
    ];

    await shopPage.navigateToShopPage('Laptops & Notebooks');

   let expectedCartTotal = 0;

    for (const product of productsToAdd) {
        await shopPage.addItemToCart(product.name);
        const notification = await shopPage.getCartNotificationDetails(product.name);

        // Add current product price to expected cart total
        expectedCartTotal += parseFloat(product.price.replace('$', ''));

        // Extracts digit before decimial point and two digits after decimal point from notification
        // creates an array of all prices using global flag (g) and match method
        // the last element in the array is the cart total
        const actualPrice = notification.priceText.match(/\d+\.\d{2}/g);
        const cartTotalFromNotification = actualPrice ? parseFloat(actualPrice[actualPrice.length - 1]) : 0;

        await expect(notification.fullText).toContain(`Success: You have added ${product.name} to your shopping cart!`);
        await expect(notification.productName).toBe(product.name);

        //to two decimal places
        expect(cartTotalFromNotification.toFixed(2)).toBe(expectedCartTotal.toFixed(2));
    }
    
    await expect(shopPage.page.locator('.cart-item-total').first()).toHaveText('3');
})