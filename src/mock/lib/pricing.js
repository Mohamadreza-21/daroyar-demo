export const roundThousand = (value) => Math.round(value / 1000) * 1000

export const priceAfterDiscount = (basePrice, discount = 0) =>
  roundThousand(basePrice * (1 - Number(discount || 0) / 100))

export function calcTotals(lines, coupon, shippingMethod) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  const savings = lines.reduce((sum, line) => sum + Math.max(0, line.basePrice - line.price) * line.qty, 0)
  const couponDiscount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0
  const afterDiscount = subtotal - couponDiscount
  const freeFrom = shippingMethod?.freeFrom ?? null
  const shipping =
    !lines.length || !shippingMethod || (freeFrom != null && afterDiscount >= freeFrom) ? 0 : shippingMethod.cost
  return {
    subtotal,
    savings,
    couponDiscount,
    shipping,
    total: afterDiscount + shipping,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
  }
}
