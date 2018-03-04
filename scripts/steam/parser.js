exports.parseAll = (elements, currency, game) => {
    let result = []

    Object.entries(elements.formatted).forEach((value, key) => {
        let timestamp = value[0]
        let data = value[1]
        let obj = {}

        if (elements.final[key]) {
            obj['initialPrice'] = elements.final[key][1]
            obj['finalPrice'] = elements.final[key][1]
        }

        if (elements.initial[key]) {
            obj['initialPrice'] = elements.initial[key][1]
        }

        obj['currency'] = currency
        obj['discount'] = data.discount
        obj['timestamp'] = timestamp.slice(0, -3)
        obj['game'] = game._id

        result.push(obj);
    });

    return result
}