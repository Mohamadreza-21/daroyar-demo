import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div
      role="alert"
      className="fixed inset-x-0 bottom-[84px] z-[150] mx-auto flex w-[min(100%-32px,480px)] items-center gap-2.5 rounded-[14px] bg-ink px-4 py-3 text-[13.5px] font-bold text-white shadow-lg min-[1025px]:bottom-6"
    >
      <WifiOff size={18} aria-hidden="true" />
      اتصال اینترنت قطع است؛ پس از وصل شدن، درخواست‌ها دوباره انجام می‌شوند.
    </div>
  )
}
