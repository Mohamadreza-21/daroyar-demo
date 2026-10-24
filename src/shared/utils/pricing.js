export function buildCartLines(items, products, state = 'ok') {
  const byId = new Map(products.map((product) => [String(product.id), product]))
  return items.map((item) => {
    const product = byId.get(String(item.id)) ?? null
    const pending = !product && state === 'loading'
    const unknown = !product && state === 'error'
    const stock = Math.max(0, Number(product?.stock) || 0)
    const available = Boolean(product) && stock > 0
    const qty = available ? Math.min(item.qty, stock) : 0
    return {
      id: item.id,
      product,
      pending,
      unknown,
      requestedQty: item.qty,
      qty,
      stock,
      available,
      limited: available && qty < item.qty,
      price: product?.price ?? 0,
      basePrice: product?.basePrice ?? product?.price ?? 0,
    }
  })
}

export function calcTotals(lines, coupon, shippingMethod) {
  const payable = lines.filter((line) => line.available)
  const subtotal = payable.reduce((sum, line) => sum + line.price * line.qty, 0)
  const savings = payable.reduce((sum, line) => sum + Math.max(0, line.basePrice - line.price) * line.qty, 0)
  const couponDiscount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0
  const afterDiscount = subtotal - couponDiscount
  const freeFrom = shippingMethod?.freeFrom ?? null
  const shipping =
    !payable.length || !shippingMethod || (freeFrom != null && afterDiscount >= freeFrom) ? 0 : shippingMethod.cost
  return {
    subtotal,
    savings,
    couponDiscount,
    shipping,
    total: afterDiscount + shipping,
    count: payable.reduce((sum, line) => sum + line.qty, 0),
    remainingForFree: freeFrom == null ? 0 : Math.max(0, freeFrom - afterDiscount),
    freeFrom,
  }
}
