const http = require('http')
const currency = require('../../utils/currency')
const db = require('./db.json')
const async = require('async')
const request = require('request')
const parser = require('./parser')
const handler = require('../../db/hander')
const sleep = require('sleep');

const fetch = (url, callback) => {
    const options = {
        url: url,
        json: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
        }
    };
    console.log('fetch '+url)
    request(options, (err, res, body) => {
        console.log('response fetched ' + url)
        body.currency = currency.listSteam()[url.split('&cc=')[1]] //inject custom currency in response
        callback(err, body)
    })
}

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

exports.run = (offset) => {
    console.info('Starting steamdb run')

    var count = 0;
    Object.entries(db).forEach(element => {
        count++;
        if (count < offset || count > offset + 10) {
            return
        }

        let gameRef = element[0]
        let gameUrls = element[1]

        console.log(gameRef)
        let urls = getUrls(gameUrls).slice(offset, 10)
        
        async.map(urls, fetch, (err, res) => {
            console.log('response are here !')
            if (err) return console.log(err);
            handler.findOne('game', {name: gameRef}, (game) => {
                console.log(gameRef)
                if (!game) {
                    handler.insert('game', {name: gameRef}, (game) => {
                        let data = parser.parseAll(res, game)
                        handler.insertSteamHistory(data)
                        return
                    })
                    return
                }
                let data = parser.parseAll(res, game)
                handler.insertSteamHistory(data, () => {})
            })
        })
    });
}