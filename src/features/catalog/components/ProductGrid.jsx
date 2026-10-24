import { memo } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 0.8, 0.3, 1] } },
}

const ProductGrid = memo(function ProductGrid({ products }) {
  return (
    <motion.ul
      className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 max-[640px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[640px]:gap-3"
      key={products.map((p) => p.id).join('-')}
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
    >
      {products.map((p) => (
        <motion.li key={p.id} variants={item}>
          <ProductCard product={p} />
        </motion.li>
      ))}
    </motion.ul>
  )
})

export default ProductGrid
