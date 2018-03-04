const steam = require('./steam/run')
const origin = require('./origin/run')
const asyn = require('async')

runners = [steam, origin]

console.info('Starting runners')
asyn.map(runners, (runner) => {
    runner.run()
})