const puppeteer = require("puppeteer");

async function collectInfo(page: Promise<puppeteer.Page>, url) {
    await page
}

(async () => {
    const chromium = await puppeteer.launch()
    const page = chromium.newPage()
})