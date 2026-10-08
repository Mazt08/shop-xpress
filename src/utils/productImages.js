const productImages = {
  hackablewatch: '/images/hackable%20watch.jpg',
  insecureshirt: '/images/insecureshirt.jpg',
  brokenbook: '/images/brokenbook.jpg',
  vulnerablephone: '/images/vulnerablephone.jpe',
  leakyrouter: '/images/leakyrouter.jpg'
}

const getProductImage = (product) => {
  const productKey = product.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return productImages[productKey] || product.imageUrl
}

export default getProductImage
