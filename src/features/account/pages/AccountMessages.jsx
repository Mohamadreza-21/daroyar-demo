import { MessageSquare } from 'lucide-react'
import { useMyMessages } from '../../contact/hooks/useMessages'
import MessageBody from '../../contact/components/MessageBody'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { EmptyState } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import { CARD, PANEL_TITLE, STACK } from '../../../shared/components/common/styles'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { PanelOrdersSkeleton } from '../../../shared/components/loaders/PanelSkeletons'

export default function AccountMessages() {
  useDocumentTitle('پیام‌های من')
  const { data, isPending, isError, error, refetch } = useMyMessages()

  if (isPending) return <PanelOrdersSkeleton />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>پیام‌های من</h1>
      {data.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="هنوز پیامی نفرستاده‌اید"
          text="پیام‌هایی که از صفحهٔ «تماس با ما» می‌فرستید و پاسخ پشتیبانی را اینجا می‌بینید."
        >
          <Button to="/contact">ارسال پیام</Button>
        </EmptyState>
      ) : (
        <ul className={STACK}>
          {data.map((message) => (
            <li key={message.id} className={CARD}>
              <MessageBody message={message} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
