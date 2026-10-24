import { memo } from 'react'
import { SectionHeading } from '../../../shared/components/common/Primitives'
import ProductCarousel from '../../catalog/components/ProductCarousel'

const FeaturedProducts = memo(function FeaturedProducts({ id, eyebrow, title, text, products, to = '/shop' }) {
  if (!products.length) return null
  return (
    <section className="section-y site-container">
      <SectionHeading eyebrow={eyebrow} title={title} text={text} to={to} />
      <ProductCarousel id={id} products={products} />
    </section>
  )
})

export default FeaturedProducts
