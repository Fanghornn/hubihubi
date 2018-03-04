exports.list = () => {
    var currencies = Object.values(exports.listSteam()).reduce(function(acc, cur, i) {
        acc[cur] = null;
        return acc;
    }, {});

    return currencies
}

exports.listSteam = () => {
    return {
        us: 'USD',
        uk: 'GBP',
        eu: 'EUR',
        ru: 'RUB',
        br: 'BRL',
        jp: 'JPY',
        id: 'IDR',
        my: 'MYR',
        ph: 'PHP',
        sg: 'SGD',
        th: 'THB',
        vn: 'VND',
        kr: 'KRW',
        tr: 'TRY',
        ua: 'UAH',
        mx: 'MXP',
        ca: 'CAD',
        nz: 'NZD',
        no: 'NOK',
        pl: 'PLN',
        ch: 'CHF',
        cn: 'CNY',
        in: 'INR',
        cl: 'CLP',
        pe: 'PEN',
        co: 'COP',
        za: 'ZAR',
        hk: 'HKD',
        tw: 'TWD',
        sa: 'SAR',
        ae: 'AED',
        ar: 'ARS',
        il: 'ILS',
        kz: 'KZT',
        kw: 'KWD',
        qa: 'QAR',
        cr: 'CRC',
        uy: 'UYU',
        az: 'CIS_USD',
        pk: 'ASIA_USD'
    }
}

exports.listOrigin = () => {
    return {
        FR : {
            locale: 'fr_FR',
            currency: 'EUR'
        },
        US : {
            locale: 'en_US',
            currency: 'USD'
        }
    }
}