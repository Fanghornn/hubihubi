exports.parseAll = (elements, currency, game) => {
    let result = []

    Object.entries(elements.formatted).forEach((value, key) => {
        let timestamp = value[0]
        let data = value[1]
        let obj = {}

        if (elements.final[key]) {
            obj['finalPrice'] = elements.final[key][1]
            obj['initialPrice'] = obj['finalPrice']
        }

        if (elements.initial[key]) {
            obj['initialPrice'] = elements.initial[key][1]
        }

        obj['currency'] = currency
        obj['timestamp'] = timestamp.slice(0, -3)
        obj['discount'] = data.discount
        obj['game'] = game._id

        result.push(obj);
    });

    return result
}