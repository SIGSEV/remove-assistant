const fs = require('fs')
const path = require('path')
const shortid = require('shortid')

const browser = require('./browser')
const flickr = require('./flickr')

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const SHOTS_DIR = path.resolve(__dirname, '../shots')

module.exports = async function screen(url, nick) {
  const b = await browser
  console.log(`>> taking a screenshot of ${url}`)
  const imgName = `${shortid.generate()}.png`
  const page = await b.newPage()

  // don't wait more than 3s for page load
  await page.goto(url, { waitUntil: 'networkidle', networkIdleTimeout: 3e3 })

  const clip = await page.evaluate(evaluate, url)

  if (!clip) {
    throw new Error('Cant find tweet node')
  }

  const filePath = path.join(SHOTS_DIR, imgName)
  await page.screenshot({
    path: filePath,
    clip,
  })

  const flickUrl = await flickr(filePath, {
    tags: [nick],
  })

  // Remove temp file
  fs.unlinkSync(filePath) // eslint-disable-line no-sync

  // don't wait more than 2s for page close
  await Promise.race([page.close(), wait(2e3)])

  return flickUrl
}

function evaluate(url) {
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
  tweetElement.style.position = 'relative'
  tweetElement.style.paddingTop = '50px'

  const dateElement = document.createElement('div')
  dateElement.style.position = 'absolute'
  dateElement.style.backgroundColor = 'yellow'
  dateElement.style.top = 0
  dateElement.style.left = 0
  dateElement.innerHTML = new Date().toISOString()
  tweetElement.appendChild(dateElement)

  const urlElement = document.createElement('div')
  urlElement.style.position = 'absolute'
  urlElement.style.backgroundColor = 'yellow'
  urlElement.style.top = `20px`
  urlElement.style.left = 0
  urlElement.innerHTML = url
  tweetElement.appendChild(urlElement)

  console.log(tweetElement.innerHTML)

  const rect = tweetElement.getBoundingClientRect()
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: Math.min(rect.height, 1950),
  }
}
