exports.parseAll = (elements, game) => {
    let result = []
    

    elements.forEach(element => {
        if (element.data === undefined) {
            console.error("Error on element " + JSON.stringify(element))
            return
        }
        if (element.data.formatted.length === 0) {
            return
        }

        Object.entries(element.data.formatted).forEach((value, key) => {
            let timestamp = value[0]
            let data = value[1]
            let obj = {}

            if (element.data.final[key]) {
                obj['initialPrice'] = element.data.final[key][1]
                obj['finalPrice'] = element.data.final[key][1]
            }

            if (element.data.initial[key]) {
                obj['initialPrice'] = element.data.initial[key][1]
            }

            obj['currency'] = element.currency
            obj['discount'] = data.discount
            obj['timestamp'] = timestamp.slice(0, -3)
            obj['game'] = game._id

            result.push(obj);
        });
    })

    return result
}