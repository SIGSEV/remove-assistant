const path = require('path')
const shortid = require('shortid')

const browser = require('./browser')

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const SHOTS_DIR = path.resolve(__dirname, '../shots')

module.exports = async function screen(url) {
  const b = await browser
  console.log(`>> taking a screenshot of ${url}`)
  const imgName = `${shortid.generate()}.jpg`
  const page = await b.newPage()

  // don't wait more than 3s for page load
  await page.goto(url, { waitUntil: 'networkidle', networkIdleTimeout: 3e3 })

  const clip = await page.evaluate(() => {
    const header = document.querySelector('[data-reactroot] header')
    const eventualCookieFooter = document.querySelector('[data-reactroot] header + div')
    if (eventualCookieFooter) {
      eventualCookieFooter.parentNode.removeChild(eventualCookieFooter)
    }
    if (header) {
      header.parentNode.removeChild(header)
    }
    const tweetElement = document.querySelector('[aria-label="Timeline: Conversation"] > div > div')
    if (!tweetElement) {
      return null
    }
    const rect = tweetElement.getBoundingClientRect()
    return { x: rect.left, y: rect.top, width: rect.width, height: Math.min(rect.height, 1950) }
  })

  if (!clip) {
    throw new Error('Cant find tweet node')
  }

  await page.screenshot({
    path: path.join(SHOTS_DIR, imgName),
    clip,
    quality: 80,
  })

  // don't wait more than 2s for page close
  await Promise.race([page.close(), wait(2e3)])

  return imgName
}
