require('dotenv').config()

const track = require('./track')
const verify = require('./verify')

console.log(`[[ STARTED REMOVE-ASSISTANT ]]`)

// verify that nobody deleted their tweets! omg we need to help!
verify()

track()
