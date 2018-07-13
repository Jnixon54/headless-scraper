const express = require('express');
const { json } = require ('body-parser');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const prettyFormat = require('pretty-format');

const URL = 'https://www.westelm.com/shop/furniture/sofas/all-sofas/?cm_type=lnav';

const app = express();

app.use(json());

const getPic = async (URL) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1000, height: 700});
    await page.goto(URL);
    // await page.screenshot({path: 'test.png'});

    await browser.close();
};

const scrape = async (URL) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(URL, {
        waitUntil: 'load',
        // dumpio: true
    });
    await page.click('#shop > div.stickyOverlayScroll.overlayScroll > div > a.stickyOverlayMinimizeButton');
    const result = await page.evaluate(() => {
        let data = [];
        let products = document.querySelectorAll('#subCatListContainer > ul > li');
        // let element = document.querySelector('.nav-menu');
        // console.log('doc', element)
        console.log(products)

        products.forEach((product) => {
            let price = '';
            let name = '';

            let isDiscounted = !eval("product.querySelectorAll('.price-standard').length > 0")
            if (product.querySelector('.product-name')) {
                name = product.querySelector('.product-name').innerText;
                console.log(name)
                
            }
            if (!isDiscounted) {
                price = product.querySelector('.price-amount').innerText;
            } else {
                price =' $$$'
            }

            // if (product.querySelectorAll('.price-state')) {
            //     let priceState = product.querySelectorAll('.price-state');
            //     priceState[0].querySelector('.price-amount')
            // }
            data.push({name, price, isDiscounted});
            // let price = element.
        });

        return data;
    });
    // #subCatListContainer > ul > li:nth-child(7) > span > span.price-state.price-sale > span:nth-child(2)
    return result;
    // await browser.close();
}
scrape(URL).then((data) => {
    console.log(prettyFormat(data));
});

// axios.get(URL).then(res => console.log('rest', res))

app.listen(3000, () => console.log('Server Running on port 3000'));