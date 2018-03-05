const http = require('http')
const currency = require('../../utils/currency')
const db = require('./db.json')
const async = require('async')
const request = require('request')
const parser = require('./parser')
const handler = require('../../db/hander')
const sleep = require('sleep');

const fetch = (url, callback) => new Promise((resolve) => {
    const options = {
        url: url,
        json: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
        }
    };

    request(options, (err, res, body) => {
        console.log('response fetched ' + url)
        body.currency = currency.listSteam()[url.split('&cc=')[1]] //inject custom currency in response
        callback(err, body)
        
        setTimeout(() => {
            console.log('Game fetch proceeded, another one can be triggered')
            resolve()
        }, 2000)
    })
})

const getUrls = (gameUrls) => {
    const baseUrl = 'https://steamdb.info/api/GetPriceHistory/'
    let urls = []
    gameUrls.forEach(gameUrl => {
        let id = gameUrl.match(/\d+/)[0]
        
        if (gameUrl.indexOf('app') > -1) {
            Object.keys(currency.listSteam()).forEach(cc => {
                urls.push(baseUrl + '?appid=' + id + '&cc=' + cc)
            });
            return
        }

        if (gameUrl.indexOf('sub') > -1) {
            Object.keys(currency.listSteam()).forEach(cc => {
                urls.push(baseUrl + '?subid=' + id + '&cc=' + cc)
            });
            return
        }

        console.log(gameUrl + ' : malformed url')
    })

    return urls
}

function createSteamRunner(offset) {
    var count = 0;
    
    console.info('\nStarting steamdb run\n')

    const gameProcesses = Object.entries(db).map(element => new Promise((resolve) => {

        count++;
        if (count < offset || count > offset + 10) {
            return
        }

        let gameRef = element[0]
        let gameUrls = element[1]

        console.log(gameRef)

        let urls = getUrls(gameUrls).slice(offset, 10)

        async.map(urls, fetch, (err, res) => {
            let resolveLater = false;

            console.log('response are here !')

            if (err) return reject(console.log(err));

            try {
                handler.findOne('game', {name: gameRef}, (game) => {
                    console.log(gameRef)
    
                    if (!game) {
                        return handler.insert('game', {name: gameRef}, (game) => {
                            let data = parser.parseAll(res, game)
                            handler.insertSteamHistory(data, resolve)
                            
                            resolve()
                        })
                    }

                    let data = parser.parseAll(res, game)
                    handler.insertSteamHistory(data)

                    resolve()
                })
            } catch (error) {
                reject(new Error(error))
            }
        })
    }))

    return Promise.all(gameProcesses)
}

// Returns a promise which resolves when steam runner ended or failed
exports.run = (offset) => createSteamRunner(offset)