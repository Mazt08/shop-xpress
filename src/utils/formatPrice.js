const formatPrice = (price) => `$${Math.round(Number(price) || 0).toLocaleString('en-US')}`

export default formatPrice
