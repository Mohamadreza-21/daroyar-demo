import { memo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquare, Send } from 'lucide-react'
import { toast } from 'sonner'
import { replySchema } from '../schemas'
import { useAdminMessages, useReplyMessage } from '../../contact/hooks/useMessages'
import MessageBody from '../../contact/components/MessageBody'
import { useClampPage, useUrlParams } from '../../../shared/hooks/useUrlState'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { Textarea } from '../../../shared/components/common/Fields'
import { EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import Button from '../../../shared/components/common/Button'
import { CARD, PANEL_TITLE, STACK, chipClass } from '../../../shared/components/common/styles'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { AdminTableSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { MESSAGE_STATUS } from '../../../shared/utils/constants'
import { formatNumber } from '../../../shared/utils/format'

const PAGE_SIZE = 6

const ReplyForm = memo(function ReplyForm({ id }) {
  const { mutate, isPending } = useReplyMessage()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(replySchema), defaultValues: { reply: '' } })
  const onSubmit = useCallback(
    ({ reply }) =>
      mutate(
        { id, reply },
        {
          onSuccess: () => toast.success('پاسخ ثبت شد'),
          onError: (error) => toast.error(error.message || 'ثبت پاسخ انجام نشد'),
        },
      ),
    [mutate, id],
  )
  return (
    <form
      className="mt-4 grid gap-3 border-t border-dashed border-line pt-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Textarea label="پاسخ شما" error={errors.reply?.message} {...register('reply')} />
      <Button type="submit" size="sm" loading={isPending} icon={<Send size={16} />} className="justify-self-start">
        ارسال پاسخ
      </Button>
    </form>
  )
})

const FILTERS = [
  { value: '', label: 'همه' },
  ...Object.entries(MESSAGE_STATUS).map(([value, { label }]) => ({ value, label })),
]

export default function AdminMessages() {
  useDocumentTitle('پیام‌ها')
  const { params, update, page, setPage } = useUrlParams()
  const status = MESSAGE_STATUS[params.get('status')] ? params.get('status') : ''
  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } = useAdminMessages({
    status: status || undefined,
    _page: page,
    _limit: PAGE_SIZE,
  })
  const { totalPages, current } = useClampPage({
    page,
    total: data?.total ?? 0,
    pageSize: PAGE_SIZE,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  if (isPending) return <AdminTableSkeleton label="در حال دریافت پیام‌ها…" />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>پیام‌ها ({formatNumber(data.total)})</h1>
      <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر وضعیت پیام">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={chipClass(status === f.value)}
            aria-pressed={status === f.value}
            onClick={() => update({ status: f.value })}
          >
            {f.label}
          </button>
        ))}
      </div>
      {data.items.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="پیامی پیدا نشد"
          text="وقتی کاربران از صفحهٔ تماس پیام بفرستند، اینجا دیده می‌شود."
        />
      ) : (
        <>
          <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت پیام‌ها…">
            <ul className={STACK}>
              {data.items.map((message) => (
                <li key={message.id} className={CARD}>
                  <MessageBody message={message} sender={`${message.name} — ${message.email}`} />
                  {message.status === 'pending' && <ReplyForm id={message.id} />}
                </li>
              ))}
            </ul>
          </BusyOverlay>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  )
}
