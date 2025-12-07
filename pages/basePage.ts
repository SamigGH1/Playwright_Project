import {Page, Locator, expect} from '@playwright/test';

export class BasePage{

    readonly page: Page;
    readonly logo: Locator;
    readonly searchBar: Locator;
    readonly searchBarCategoryDropdown: Locator;
    readonly searchBarButton: Locator;
    readonly compareButton: Locator;
    readonly wishlistButton: Locator;
    readonly cartButton: Locator;
    readonly shopByCategoryNavButton: Locator;
    readonly homeNavButton: Locator;
    readonly specialNavButton: Locator;
    readonly blogNavButton: Locator;
    readonly megaMenuNavDropdownButton: Locator;
    readonly addOnsNavDropdownButton: Locator;
    readonly myAccountNavDropdownButton: Locator;

    constructor(page: Page){
        this.page = page
        this.logo = page.locator("//a[@title='Poco Electro']")
        this.searchBar = page.locator("(//input[@aria-label='Search For Products'])[1]")
        this.searchBarCategoryDropdown = page.locator("(//div[@class = 'dropdown search-category']//button)[1]")
        this.searchBarButton = page.locator("(//div[@class='search-button']//button[@type = 'submit'])[1]")
        this.compareButton = page.locator("//a[@aria-label = 'Compare']")
        this.wishlistButton = page.locator("//a[@aria-label = 'Wishlist']");
        this.cartButton = page.locator("(//a[@aria-controls='cart-total-drawer'])[1]")
        this.shopByCategoryNavButton = page.locator("(//a[@aria-label = 'Shop by Category'])[2]")
        this.homeNavButton = page.locator("//span[contains(., 'Home')]")
        this.specialNavButton = page.locator("(//span[contains(., 'Special')])[2]")
        this.blogNavButton = page.locator("(//span[contains(text(), 'Blog')])[2]")
        this.megaMenuNavDropdownButton = page.locator("//span[contains(text(), 'Mega Menu')]")
        this.addOnsNavDropdownButton = page.locator("//span[contains(text(), 'AddOns')]")
        this.myAccountNavDropdownButton = page.locator("(//span[contains(text(), 'My account')])[2]")
    }

    async navigateToHomePage(): Promise<void>{
        await this.homeNavButton.click();
    }

    async navigateToShopPage(category: string): Promise <void>
    {
        await this.shopByCategoryNavButton.click();
        const categoryLink = this.page.locator(`.navbar-nav.vertical >> text=${category}`);
        await categoryLink.waitFor({ state: 'visible', timeout: 5000 });
        await categoryLink.click();
        await this.page.waitForLoadState('networkidle');
        
    }

    async navigateToSpecialPage(): Promise<void>
    {
        await this.specialNavButton.click();
    }

    async navigateToBlogPage(): Promise<void>
    {
        await this.blogNavButton.click();
    }

    async navigateToMyAccountPage(): Promise<void>
    {
        await this.myAccountNavDropdownButton.click();
    }
}