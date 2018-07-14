const express = require('express');
const { json } = require ('body-parser');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');
const { USERNAME, PASSWORD } = require('./.config');

const electricityUsageLogin = 'https://myaccount.greenmountain.com/Account/UsageHistory';

const app = express();

app.use(json());

let seriesData = {
    series_usage_cost : [],
    series_usage_kWh : [],
    series_usage_temp : [],
    series_usage_ticks : []
};

const scrape = async () => {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    const logIn = async (url) => {
        console.log('Logging In...');
        await page.type('#UserName', USERNAME);
        await page.type('#Password', PASSWORD);
        const navPromise = page.waitForNavigation({ waitUntil: 'load' });

        console.log('Submitting Credentials...');
        await page.click('#submit');
        await navPromise;

        console.log('Navigation complete...');
        return;
    };
    
    const checkForModal = () => {
        const result = page.evaluate(() => {
            let handleModal = () => {
                let modal = document.querySelector('#mcx_decline');
                if (modal) {
                    console.log('Modal Detected...');
                    return true;
                }
                intervalCount++;
                console.log('Count: ', intervalCount);

                if (intervalCount === 5) {
                    return true;
                }

                return false;
            };

            let intervalCount = 0;
            let waitForModalPromise = new Promise((resolve, reject) => {
                let interval = window.setInterval(() => {
                    if (handleModal()) {
                        window.clearInterval(interval);
                        resolve();
                        document.querySelector('#mcx_decline').click();
                    };
                }, 1000);
            });
            return waitForModalPromise;
        });
        return result;
    
    }
    console.log('Navigating to login page...');
    await page.goto(electricityUsageLogin);
    // await page.waitFor(3000);
    console.log('Checking for modal...')
    await checkForModal();
    await logIn(electricityUsageLogin);

    seriesData = await page.evaluate(() => {
        let series = {};
        series.series_usage_cost = window.series_usage_cost;
        series.series_usage_kWh = window.series_usage_kWh;
        series.series_usage_temp = window.series_usage_temp;
        series.series_usage_ticks = window.series_usage_ticks;
        return { ...series };
    });

    console.log(seriesData);
};

scrape();

app.listen(3000, () => console.log('Server Running on port 3000'));