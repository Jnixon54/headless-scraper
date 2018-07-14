const express = require('express');
const { json } = require ('body-parser');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const prettyFormat = require('pretty-format');
const { USERNAME, PASSWORD } = require('./.config');

console.log(USERNAME, PASSWORD)


// const URL = 'https://www.westelm.com/shop/furniture/sofas/all-sofas/?cm_type=lnav';
const electricityUsageLogin = 'https://myaccount.greenmountain.com/Account/UsageHistory';

const app = express();

app.use(json());

// const getPic = async (URL) => {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.setViewport({width: 1000, height: 700});
//     await page.goto(URL);
//     // await page.screenshot({path: 'test.png'});

//     await browser.close();
// };



const scrape = async (url) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const logIn = async (url) => {
        await page.type('#UserName', USERNAME);
        await page.type('#Password', PASSWORD);
        await page.click('#submit');
    
    };
    
    const checkForModal = () => {
        console.log(page)
        const result = page.evaluate(() => {
            let intervalCount = 0;
            let interval = window.setInterval(() => {
                let modal = document.querySelector('#mcx_decline');
                console.log(modal);
                if (modal) {
                    document.querySelector('#mcx_decline').click();
                    window.clearInterval(interval);
                }
                intervalCount++;
                if (intervalCount === 5) window.clearInterval(interval);
            }, 1000);
        });
        return result;
    
    }

    await page.goto(electricityUsageLogin);
    await page.waitFor(1000);
    await checkForModal();
    await logIn(electricityUsageLogin);

    
};

// const scrape = async (URL) => {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto(URL, {
//         waitUntil: 'load',
//         // dumpio: true
//     });
//     await page.click('#shop > div.stickyOverlayScroll.overlayScroll > div > a.stickyOverlayMinimizeButton');
//     const result = await page.evaluate(() => {
//         let data = [];
//         let products = document.querySelectorAll('#subCatListContainer > ul > li');
//         // let element = document.querySelector('.nav-menu');
//         // console.log('doc', element)
//         console.log(products)

//         products.forEach((product) => {
//             let price = '';
//             let name = '';

//             let isDiscounted = !eval("product.querySelectorAll('.price-standard').length > 0")
//             if (product.querySelector('.product-name')) {
//                 name = product.querySelector('.product-name').innerText;
//                 console.log(name)
                
//             }
//             if (!isDiscounted) {
//                 price = product.querySelector('.price-amount').innerText;
//             } else {
//                 price =' $$$'
//             }

//             // if (product.querySelectorAll('.price-state')) {
//             //     let priceState = product.querySelectorAll('.price-state');
//             //     priceState[0].querySelector('.price-amount')
//             // }
//             data.push({name, price, isDiscounted});
//             // let price = element.
//         });

//         return data;
//     });
//     // #subCatListContainer > ul > li:nth-child(7) > span > span.price-state.price-sale > span:nth-child(2)
//     return result;
//     // await browser.close();
// }
// scrape(URL).then((data) => {
//     console.log(prettyFormat(data));
// });

scrape('home');

// axios.get(URL).then(res => console.log('rest', res))

// app.listen(3000, () => console.log('Server Running on port 3000'));