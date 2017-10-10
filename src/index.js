require('dotenv').config()

const track = require('./track')
const verify = require('./verify')
const serveSlack = require('./slack-server')

console.log(`[[ STARTED REMOVE-ASSISTANT ]]`)

// verify that nobody deleted their tweets! omg we need to help!
verify()

track()
serveSlack()
