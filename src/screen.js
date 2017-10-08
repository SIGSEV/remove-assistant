const path = require('path')
const puppeteer = require('puppeteer')
const shortid = require('shortid')

const SHOTS_DIR = path.resolve(__dirname, '../shots')

let browser
puppeteer
  .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  .then(b => (browser = b))
  .catch(err => {
    console.log(`x Cant launch browser: ${err}`)
    process.exit(1)
  })

module.exports = async function screen(url) {
  if (!browser) {
    return
  }
  console.log(`>> taking a screenshot of ${url}`)
  const page = await browser.newPage()
  await page.goto(url)
  const imgName = `${shortid.generate()}.jpg`
  await page.screenshot({ path: path.join(SHOTS_DIR, imgName) })
  await page.close()
  return imgName
}

process.on('SIGINT', async () => {
  if (browser) {
    await browser.close()
  }
  process.exit()
})
