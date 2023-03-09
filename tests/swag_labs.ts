import { Selector } from 'testcafe';
import { faker } from '@faker-js/faker';

// import testing URL and credentials from configuration file
const config = require("../.testcaferc.json");

const username = config.username;
const password = config.password;

fixture `Assessment | Quality Assurance | Swag Labs`
    .page(config.baseUrl)
    .beforeEach(async t => {

        await t
            .maximizeWindow()
            .typeText(Selector('input[id="user-name"]'), username)
            .typeText('input[id="password"]', password)
            .click('input[id="login-button"][value="Login"]');
    }
);

const prodName1 = 'Sauce Labs Fleece Jacket';
const prodName2 = 'Sauce Labs Bolt T-Shirt';
const prodPrice = '$49.99';
const successMsg = 'Thank you for your order!';

//auto-generate inputs
const firstname = faker.name.firstName();
const lastName = faker.name.lastName();
const zipCode = faker.address.zipCode();

// products page related locators
class Products {
    price = Selector('div.page_wrapper div.inventory_container div.inventory_list div.inventory_item:nth-child(4) div.inventory_item_description div.pricebar > div.inventory_item_price');
    product1 = Selector('button[id="add-to-cart-sauce-labs-fleece-jacket"]');
    product2 = Selector('button[id="add-to-cart-sauce-labs-bolt-t-shirt"]');
    cartBadge = Selector('.shopping_cart_link');
    cartIcon = Selector('#shopping_cart_container');
}

// shopping cart related locators
class Cart {
    cartTitle = Selector("div.page_wrapper div:nth-child(1) div.header_container div.header_secondary_container > span.title");
    cartContent_1 = Selector("#cart_contents_container").withText(prodName1);
    cartContent_2 = Selector("#cart_contents_container").withText(prodName2);
    clickCheckout = Selector('button[id="checkout"]');
}

// checkout page related locators
class CheckOut {
    enterFname = Selector("input[id='first-name']");
    enterLname = Selector("input[id='last-name']");
    enterZipcode = Selector("input[id='postal-code']");
    clickContinue = Selector("#continue");
    clickFinish = Selector("button[id='finish']");
    viewOrderComplete = Selector("div:nth-child(2) div.page_wrapper div:nth-child(1) div.checkout_complete_container > h2.complete-header");
}

const products = new Products();
const cart = new Cart(); 
const checkout = new CheckOut(); 

test('Compare price tag of Sauce Labs Fleece Jacket & Checkout items in shopping cart', async t1 => {

   
    await t1
        // compare price tag of Fleece Jacket
        .expect(products.price.innerText).contains(prodPrice)
    
        // select 2 items to shopping cart
        .click(products.product1)
        .click(products.product2)
        .click(products.cartIcon)
        .wait(2000)

        // check selected items appear in the checkout
        .expect(cart.cartContent_1.exists).ok()
        .expect(cart.cartContent_2.exists).ok()
        .click(cart.clickCheckout)

        // enter checkout details
        .typeText(checkout.enterFname, firstname)
        .typeText(checkout.enterLname, lastName)
        .typeText(checkout.enterZipcode, zipCode)
        .click(checkout.clickContinue)
        .wait(2000)
        .click(checkout.clickFinish)

        // view completion page
        .expect(checkout.viewOrderComplete.innerText).eql(successMsg)

        .wait(2000)
});


