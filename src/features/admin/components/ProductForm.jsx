import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../schemas'
import { useCategories } from '../../catalog/hooks/useCatalog'
import { applyServerErrors } from '../../../shared/api/client'
import { Input, Select, Textarea } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'
import { FORM_ACTIONS, FORM_GRID } from '../../../shared/components/common/styles'

const EMPTY = {
  title: '',
  brand: '',
  category: '',
  basePrice: '',
  discount: 0,
  stock: 10,
  thumbnail: '',
  description: '',
}

const toForm = (p) =>
  p
    ? {
        title: p.title,
        brand: p.brand,
        category: p.category,
        basePrice: p.basePrice,
        discount: p.discount,
        stock: p.stock,
        thumbnail: p.thumbnail,
        description: p.description,
      }
    : EMPTY

const ProductForm = memo(function ProductForm({ product, loading, serverError, onSubmit, onCancel }) {
  const { data: categories = [] } = useCategories()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema), defaultValues: toForm(product) })

  useEffect(() => reset(toForm(product)), [product, reset])
  useEffect(() => {
    if (serverError) applyServerErrors(serverError, setError)
  }, [serverError, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={FORM_GRID}>
        <Input className="col-span-full" label="نام محصول" error={errors.title?.message} {...register('title')} />
        <Input label="برند" error={errors.brand?.message} {...register('brand')} />
        <Select label="دسته‌بندی" error={errors.category?.message} {...register('category')}>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </Select>
        <Input
          label="قیمت پایه (تومان)"
          type="number"
          inputMode="numeric"
          ltr
          error={errors.basePrice?.message}
          {...register('basePrice')}
        />
        <Input
          label="تخفیف (٪)"
          type="number"
          inputMode="numeric"
          ltr
          error={errors.discount?.message}
          {...register('discount')}
        />
        <Input
          label="موجودی"
          type="number"
          inputMode="numeric"
          ltr
          error={errors.stock?.message}
          {...register('stock')}
        />
        <Input
          label="آدرس تصویر"
          ltr
          placeholder="/images/placeholder.svg"
          error={errors.thumbnail?.message}
          {...register('thumbnail')}
        />
        <Textarea
          className="col-span-full"
          label="توضیحات"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>
      <div className={FORM_ACTIONS}>
        <Button variant="ghost" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" loading={loading}>
          {product ? 'ذخیرهٔ تغییرات' : 'افزودن محصول'}
        </Button>
      </div>
    </form>
  )
})

export default ProductForm
