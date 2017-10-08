const path = require('path')
const puppeteer = require('puppeteer')
const shortid = require('shortid')

const SHOTS_DIR = path.resolve(__dirname, '../shots')

module.exports = async function screen(url) {
  console.log(`>> taking a screenshot of ${url}`)
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(url)
  const imgName = `${shortid.generate()}.jpg`
  await page.screenshot({ path: path.join(SHOTS_DIR, imgName) })
  await browser.close()
  return imgName
}
