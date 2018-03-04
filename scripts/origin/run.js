const phantom = require('phantom');
const URL = require('url')
const db = require('./db.json')
const parser = require('./parser')
const currency = require('../../utils/currency')
const querystring = require('querystring');
const async = require('async')
const request = require('request')
const handler = require('../../db/hander')

const fetch = (url, callback) => {
    const options = {
        url: url,
        json: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36'
        }
    };
    request(options, (err, res, body) => {
        callback(err, body)
    })
}

async function fetchOffer(gameUrl, callback) {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on("onResourceRequested", function(requestData) {
        //console.info('Requesting', requestData.url)
        if (requestData.url.indexOf('https://api4.origin.com/supercarp/rating/offers/anonymous') > -1) {
            instance.exit()
            callback(requestData.url)
        }
    });

    const status = await page.open(gameUrl);
};

Object.entries(db).forEach(element => {
    let gameRef = element[0]
    let gameUrls = element[1]

    let urls = []
    gameUrls.forEach(gameUrl => {
        fetchOffer(gameUrl, (offerUrl) => {
            let dataUrl = URL.parse(offerUrl, true)
            const offerId = dataUrl.query.offerIds.split(',')[0]

            Object.entries(currency.listOrigin()).forEach(dataCurrency => {
                let country = dataCurrency[0]
                dataUrl.query.country = dataCurrency[0]
                dataUrl.query.locale = dataCurrency[1].locale
                dataUrl.query.currency = dataCurrency[1].currency
                dataUrl.query.offerIds = offerId

                urls.push(
                    dataUrl.protocol + '//' + dataUrl.host + dataUrl.pathname + '?' + querystring.stringify(dataUrl.query)
                )
            });

            console.log(urls)

            async.map(urls, fetch, (err, res) => {
                if (err) return console.log(err);
                handler.findOne('game', {name: gameRef}, (game) => {
                    console.log(game)
                    if (!game) {
                        console.error(gameRef + ' not found')
                        return
                    }

                    let data = parser.parseAll(res, game)
                    handler.insertOriginHistory(data)
                })
            })
        })   
    })
});