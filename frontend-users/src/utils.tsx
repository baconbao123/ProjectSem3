import Product from './Interfaces/Product'

export function sliceText(text: string, length: number) {
  return text.length >= length ? text.slice(0, length) + '...' : text
}

export function calculateTotalPrice(price: string, quantity: string) {
  return Number(price) * Number(quantity)
}

export const calculateTotalOrderPrice = (product: Product[]) => {
  return product.reduce((acc, product) => {
    const totalPrice = product.SellPrice
      ? calculateTotalPrice(product.SellPrice, product.Quantity)
      : calculateTotalPrice(product.BasePrice, product.Quantity)
    return acc + totalPrice
  }, 0)
}
