import { memo } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDialogA11y, useLockBodyScroll } from '../../hooks/useUtils'
import { cn } from '../../utils/format'
import Button, { ICON_BTN } from './Button'

const PANEL_WIDTH = {
  sm: 'w-[min(100%,420px)]',
  md: 'w-[min(100%,560px)]',
  lg: 'w-[min(100%,720px)]',
}

const Modal = memo(function Modal({ open, onClose, title, size = 'md', children }) {
  useLockBodyScroll(open)

  const dialogRef = useDialogA11y(open, onClose)

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-[rgba(10,30,34,0.55)] backdrop-blur-[4px]" onClick={onClose} />
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'relative max-h-[calc(100vh-32px)] overflow-auto rounded-lg bg-surface shadow-lg',
              PANEL_WIDTH[size],
            )}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            <div className="sticky top-0 z-[2] flex items-center justify-between border-b border-line bg-surface px-6 py-[18px]">
              <h3 className="text-[18px]">{title}</h3>
              <button type="button" className={ICON_BTN} onClick={onClose} aria-label="بستن">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
})

export default Modal

export const ConfirmDialog = memo(function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel = 'تأیید',
  loading,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="mb-5 text-muted">{text}</p>
      <div className="flex justify-end gap-2.5">
        <Button variant="ghost" onClick={onClose}>
          انصراف
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
})
