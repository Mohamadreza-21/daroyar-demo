import { useClampPage, useSearchInput, useUrlParams } from '../../../shared/hooks/useUrlState'
import BusyOverlay from '../../../shared/components/common/BusyOverlay'
import { memo, useCallback } from 'react'
import { Search, Users } from 'lucide-react'
import { useUsers } from '../hooks/useAdmin'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { Badge, EmptyState, Pagination } from '../../../shared/components/common/Primitives'
import {
  SEARCHFIELD,
  CELL_USER,
  CELL_USER_NAME,
  PANEL_TITLE,
  SEARCH_ICON,
  SEARCH_INPUT,
  STACK,
  TABLE,
  TABLE_WRAP,
  TD,
  TH,
  TR,
} from '../../../shared/components/common/styles'
import { AVATAR } from '../../../shared/components/common/Primitives'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { AdminTableSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { cn, formatNumber } from '../../../shared/utils/format'
import { handleImgError } from '../../../shared/utils/image'

const LIMIT = 10
const ROLE = {
  admin: ['مدیر', 'danger'],
  moderator: ['ناظر', 'warn'],
  user: ['کاربر', 'info'],
  customer: ['مشتری', 'info'],
}

const Row = memo(function Row({ user }) {
  const [label, tone] = ROLE[user.role] ?? ROLE.user
  return (
    <tr className={TR}>
      <td className={TD}>
        <div className={CELL_USER}>
          {user.image ? (
            <img onError={handleImgError} className={cn(AVATAR, 'shrink-0')} src={user.image} alt="" loading="lazy" />
          ) : (
            <span className={cn(AVATAR, 'shrink-0')} aria-hidden="true">
              {user.firstName?.charAt(0)}
            </span>
          )}
          <div>
            <b dir="auto" className={CELL_USER_NAME}>
              {user.firstName} {user.lastName}
            </b>
            <small dir="ltr" className="text-muted">
              @{user.username}
            </small>
          </div>
        </div>
      </td>
      <td dir="ltr" className={cn(TD, 'text-start')}>
        {user.email}
      </td>
      <td dir="ltr" className={cn(TD, 'text-start')}>
        {user.phone}
      </td>
      <td className={TD}>
        <Badge tone={tone}>{label}</Badge>
      </td>
    </tr>
  )
})

export default function AdminUsers() {
  useDocumentTitle('کاربران')
  const { params, update: setParam, page, setPage } = useUrlParams()
  const qParam = params.get('q') ?? ''
  const commitSearch = useCallback((value) => setParam({ q: value }, { replace: true }), [setParam])
  const search = useSearchInput(qParam, commitSearch)
  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } = useUsers({
    q: qParam || undefined,
    _page: page,
    _limit: LIMIT,
  })

  const { totalPages, current } = useClampPage({
    page,
    total: data?.total ?? 0,
    pageSize: LIMIT,
    ready: !!data && !isPlaceholderData,
    setPage,
  })

  if (isPending) return <AdminTableSkeleton label="در حال دریافت کاربران…" variant="orbit" />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  return (
    <div className={STACK}>
      <h1 className={PANEL_TITLE}>مدیریت کاربران ({formatNumber(data.total)})</h1>
      <label className={SEARCHFIELD}>
        <Search size={18} className={SEARCH_ICON} aria-hidden="true" />
        <input
          className={SEARCH_INPUT}
          type="search"
          value={search.text}
          onChange={(event) => search.onChange(event.target.value)}
          placeholder="جستجو در نام، نام کاربری یا ایمیل…"
          aria-label="جستجو در کاربران"
        />
      </label>
      {data.items.length ? (
        <>
          <BusyOverlay busy={isPlaceholderData && isFetching} label="در حال دریافت کاربران…" variant="orbit">
            <div className={TABLE_WRAP}>
              <table className={TABLE}>
                <caption className="sr-only">فهرست کاربران</caption>
                <thead>
                  <tr>
                    <th scope="col" className={TH}>
                      کاربر
                    </th>
                    <th scope="col" className={TH}>
                      ایمیل
                    </th>
                    <th scope="col" className={TH}>
                      تلفن
                    </th>
                    <th scope="col" className={TH}>
                      نقش
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((user) => (
                    <Row key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </BusyOverlay>
          <Pagination page={current} totalPages={totalPages} onChange={setPage} />
        </>
      ) : (
        <EmptyState icon={Users} title="کاربری پیدا نشد" />
      )}
    </div>
  )
}
