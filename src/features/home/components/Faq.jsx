import { memo, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '../../../shared/components/common/Primitives'
import { FAQS } from '../data'
import { cn } from '../../../shared/utils/format'

const Item = memo(function Item({ index, q, a, open, onToggle }) {
  const toggle = useCallback(() => onToggle(index), [onToggle, index])
  return (
    <li
      className={cn(
        'overflow-hidden rounded-[20px] border border-line bg-surface [transition:border-color_0.2s,box-shadow_0.2s]',
        open && 'border-primary-100 shadow-sm',
      )}
    >
      <h3 className="[font-size:inherit]">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-[22px] py-[18px] text-start font-extrabold"
          onClick={toggle}
          aria-expanded={open}
        >
          <span>{q}</span>
          <ChevronDown
            size={20}
            className={cn(
              'shrink-0 text-primary [transition:transform_0.3s,translate_0.3s,rotate_0.3s,scale_0.3s]',
              open && 'rotate-180',
            )}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <p className="px-[22px] pb-5 leading-[2] text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
})

const Faq = memo(function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const onToggle = useCallback((i) => setOpenIndex((cur) => (cur === i ? -1 : i)), [])
  return (
    <section className="section-y site-container">
      <SectionHeading center eyebrow="سؤال دارید؟" title="پرسش‌های متداول" />
      <ul className="mx-auto grid max-w-[820px] gap-3">
        {FAQS.map((f, i) => (
          <Item key={f.q} index={i} q={f.q} a={f.a} open={openIndex === i} onToggle={onToggle} />
        ))}
      </ul>
    </section>
  )
})

export default Faq
