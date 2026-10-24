import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { ConfirmDialog } from '../../../shared/components/common/Modal'
import { useLogout } from '../hooks/useAuthActions'

const LogoutDialog = memo(function LogoutDialog({ open, onClose }) {
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()

  const onConfirm = useCallback(() => {
    onClose()
    navigate('/', { replace: true })
    logout(undefined, { onSettled: () => toast.success('با موفقیت خارج شدید') })
  }, [logout, navigate, onClose])

  return (
    <ConfirmDialog
      open={open}
      title="خروج از حساب کاربری"
      text="آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟"
      confirmLabel="خروج از حساب"
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
})

export default LogoutDialog
