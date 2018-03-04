exports.parseAll = (elements, game) => {
    let result = []

    elements.forEach(element => {
        let offer = element.offer[0]
        let pricing = offer.rating[0]
        let obj = {}

        obj['initialPrice'] = pricing.originalTotalPrice
        obj['finalPrice'] = pricing.finalTotalAmount
        obj['currency'] = pricing.currency
        obj['discount'] = pricing.totalDiscountRate * 100

        let now = new Date();
        let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let timestamp = startOfDay / 1000;
        obj['timestamp'] = timestamp
        obj['game'] = game._id

        result.push(obj)
    })

    return result
}