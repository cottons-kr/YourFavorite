const puppeteer = require("puppeteer")

async function collectInfo(page, url) {
    await page.goto(url, { waitUntil: "load" })
    const element = await page.evaluate(() => {
        const sub = window.getElementByXpath(`//*[@id="subscriber-count"]`)
        return sub
    })
    return Promise.resolve(element)
}

export default (async () => {
    const chromium = await puppeteer.launch({ headless: false })

    let query = ["essentialme"]
    let tasks = []
    for (let i=0; i<query.length; i++) {
        const page = await chromium.newPage()
        await page.exposeFunction("getElementByXpath", (xpath) => {
            document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        })
        tasks.push(collectInfo(page, `https://www.youtube.com/c/${query[i]}`))
    }

    Promise.all(tasks).then(res => {
        for (let i=0; i<query.length; i++) {
            console.log(res[i])
        }
    })
})()