const path = require('path')
const shortid = require('shortid')

const browser = require('./browser')

const SHOTS_DIR = path.resolve(__dirname, '../shots')

module.exports = async function screen(url) {
  const b = browser()
  if (!b) {
    return
  }
  console.log(`>> taking a screenshot of ${url}`)
  const page = await b.newPage()
  await page.goto(url)
  const imgName = `${shortid.generate()}.jpg`
  await page.screenshot({
    path: path.join(SHOTS_DIR, imgName),
    fullPage: true,
  })
  await page.close()
  return imgName
}
