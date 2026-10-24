import { memo } from 'react'
import { Badge } from '../../../shared/components/common/Primitives'
import { MESSAGE_STATUS } from '../../../shared/utils/constants'
import { formatDate } from '../../../shared/utils/format'

const MessageBody = memo(function MessageBody({ message, sender }) {
  const status = MESSAGE_STATUS[message.status] ?? MESSAGE_STATUS.pending
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <b dir="auto" className="block">
            {message.subject}
          </b>
          <small className="block text-muted">
            {sender && (
              <>
                <span dir="auto">{sender}</span> ·{' '}
              </>
            )}
            {formatDate(message.createdAt)}
          </small>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </header>
      <p dir="auto" className="mt-3.5 whitespace-pre-line leading-[1.9]">
        {message.message}
      </p>
      {message.status === 'answered' && (
        <div className="mt-4 rounded-[16px] border border-primary-100 bg-primary-50 p-4">
          <small className="mb-1 block font-extrabold text-primary-700">
            پاسخ پشتیبانی · {formatDate(message.repliedAt)}
          </small>
          <p dir="auto" className="whitespace-pre-line leading-[1.9]">
            {message.reply}
          </p>
        </div>
      )}
    </>
  )
})

export default MessageBody
