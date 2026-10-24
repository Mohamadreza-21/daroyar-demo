import { memo, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { categorySchema } from '../schemas'
import { applyServerErrors } from '../../../shared/api/client'
import { useCategories, useCatalogMeta } from '../../catalog/hooks/useCatalog'
import { useCategoryMutations } from '../hooks/useAdmin'
import { useDocumentTitle } from '../../../shared/hooks/useUtils'
import { EmptyState } from '../../../shared/components/common/Primitives'
import Button, { ICON_BTN } from '../../../shared/components/common/Button'
import {
  CARD_ROW,
  FORM_ACTIONS,
  FORM_GRID,
  PANEL_TITLE,
  ROW_ACTIONS,
  STACK,
  TABLE,
  TABLE_WRAP,
  TD,
  TH,
  TR,
} from '../../../shared/components/common/styles'
import Modal, { ConfirmDialog } from '../../../shared/components/common/Modal'
import { Input, Select } from '../../../shared/components/common/Fields'
import ErrorState from '../../../shared/components/feedback/ErrorState'
import { AdminTableSkeleton } from '../../../shared/components/loaders/AdminSkeletons'
import { CATEGORY_ICONS, CATEGORY_TONES } from '../../../shared/utils/constants'
import { cn, formatNumber } from '../../../shared/utils/format'

const EMPTY = { slug: '', label: '', blurb: '', tone: 'teal', icon: 'Sparkles' }

const CategoryForm = memo(function CategoryForm({ category, loading, serverError, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(categorySchema), defaultValues: category ?? EMPTY })
  useEffect(() => reset(category ?? EMPTY), [category, reset])
  useEffect(() => {
    if (serverError) applyServerErrors(serverError, setError)
  }, [serverError, setError])
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={FORM_GRID}>
        <Input label="نام دسته" error={errors.label?.message} {...register('label')} />
        <Input
          label="شناسه (انگلیسی)"
          ltr
          disabled={Boolean(category)}
          hint={category ? 'شناسه پس از ساخت قابل تغییر نیست' : 'مثلاً vitamins'}
          error={errors.slug?.message}
          {...register('slug')}
        />
        <Input className="col-span-full" label="توضیح کوتاه" error={errors.blurb?.message} {...register('blurb')} />
        <Select label="آیکن" error={errors.icon?.message} {...register('icon')}>
          {Object.keys(CATEGORY_ICONS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        <Select label="رنگ" error={errors.tone?.message} {...register('tone')}>
          {CATEGORY_TONES.map((tone) => (
            <option key={tone.value} value={tone.value}>
              {tone.label}
            </option>
          ))}
        </Select>
      </div>
      <div className={FORM_ACTIONS}>
        <Button variant="ghost" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" loading={loading}>
          {category ? 'ذخیرهٔ تغییرات' : 'افزودن دسته'}
        </Button>
      </div>
    </form>
  )
})

export default function AdminCategories() {
  useDocumentTitle('مدیریت دسته‌بندی‌ها')
  const { data: categories, isPending, isError, error, refetch } = useCategories()
  const { data: meta } = useCatalogMeta()
  const { create, update, remove } = useCategoryMutations()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const closeForm = useCallback(() => {
    setEditing(null)
    create.reset()
    update.reset()
  }, [create, update])

  const onSubmit = useCallback(
    (form) => {
      const done = (msg) => ({
        onSuccess: () => {
          toast.success(msg)
          setEditing(null)
        },
        onError: (e) => {
          if (!e.fieldErrors) toast.error(e.message || 'عملیات انجام نشد')
        },
      })
      if (editing === 'new') create.mutate(form, done('دستهٔ جدید افزوده شد'))
      else update.mutate({ id: editing.id, form }, done('دسته ویرایش شد'))
    },
    [editing, create, update],
  )

  if (isPending) return <AdminTableSkeleton label="در حال دریافت دسته‌بندی‌ها…" />
  if (isError) return <ErrorState error={error} onRetry={refetch} compact home={false} />

  return (
    <div className={STACK}>
      <div className={CARD_ROW}>
        <h1 className={PANEL_TITLE}>دسته‌بندی‌ها ({formatNumber(categories.length)})</h1>
        <Button onClick={() => setEditing('new')} icon={<Plus size={18} />}>
          دستهٔ جدید
        </Button>
      </div>
      {categories.length ? (
        <div className={TABLE_WRAP}>
          <table className={TABLE}>
            <caption className="sr-only">فهرست دسته‌بندی‌ها</caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>
                  نام
                </th>
                <th scope="col" className={TH}>
                  شناسه
                </th>
                <th scope="col" className={TH}>
                  تعداد محصول
                </th>
                <th scope="col" className={TH}>
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((item) => (
                <tr key={item.id} className={TR}>
                  <td className={TD}>
                    <b>{item.label}</b>
                    <small className="block text-muted">{item.blurb}</small>
                  </td>
                  <td dir="ltr" className={cn(TD, 'text-start')}>
                    {item.slug}
                  </td>
                  <td className={TD}>{formatNumber(meta?.counts?.[item.slug] ?? 0)}</td>
                  <td className={TD}>
                    <div className={ROW_ACTIONS}>
                      <button
                        type="button"
                        className={cn(ICON_BTN, 'size-[38px]')}
                        onClick={() => setEditing(item)}
                        aria-label={`ویرایش ${item.label}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        className={cn(ICON_BTN, 'size-[38px] hover:bg-danger-50 hover:text-danger')}
                        onClick={() => setDeleting(item)}
                        aria-label={`حذف ${item.label}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Tags} title="دسته‌ای وجود ندارد" text="با دکمهٔ «دستهٔ جدید» اولین دسته را بسازید." />
      )}
      <Modal open={Boolean(editing)} onClose={closeForm} title={editing === 'new' ? 'افزودن دسته' : 'ویرایش دسته'}>
        <CategoryForm
          category={editing === 'new' ? null : editing}
          loading={create.isPending || update.isPending}
          serverError={create.error ?? update.error}
          onSubmit={onSubmit}
          onCancel={closeForm}
        />
      </Modal>
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        loading={remove.isPending}
        title="حذف دسته"
        text={`دستهٔ «${deleting?.label ?? ''}» حذف شود؟ دسته‌ای که محصول دارد حذف نمی‌شود.`}
        confirmLabel="حذف"
        onConfirm={() =>
          remove.mutate(deleting.id, {
            onSuccess: () => {
              toast.success('دسته حذف شد')
              setDeleting(null)
            },
            onError: (e) => {
              toast.error(e.message || 'حذف انجام نشد')
              setDeleting(null)
            },
          })
        }
      />
    </div>
  )
}
