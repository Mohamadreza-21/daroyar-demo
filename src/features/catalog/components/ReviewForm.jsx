import { memo, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Star } from 'lucide-react'
import { toast } from 'sonner'
import { reviewSchema } from '../schemas'
import { useAddReview } from '../hooks/useCatalog'
import { Textarea } from '../../../shared/components/common/Fields'
import Button from '../../../shared/components/common/Button'
import { applyServerErrors } from '../../../shared/api/client'
import { cn } from '../../../shared/utils/format'

const StarPicker = memo(function StarPicker({ value, onChange, error }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-[13.5px] font-bold text-ink-2" id="review-rating-label">
        امتیاز شما
      </span>
      <div className="flex gap-1" role="radiogroup" aria-labelledby="review-rating-label">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} از ۵`}
            className="grid size-10 place-items-center rounded-[12px] [transition:transform_0.2s,translate_0.2s,rotate_0.2s,scale_0.2s,background_0.2s] hover:scale-110 hover:bg-primary-50"
            onClick={() => onChange(i)}
          >
            <Star size={26} className={cn(value >= i ? 'fill-gold text-gold' : 'text-[#d9e4e3]')} />
          </button>
        ))}
      </div>
      {error && (
        <p className="text-[12.5px] font-semibold text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

const ReviewForm = memo(function ReviewForm({ productId }) {
  const { mutate, isPending } = useAddReview(productId)
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, comment: '' } })

  const onSubmit = useCallback(
    (values) =>
      mutate(values, {
        onSuccess: () => {
          toast.success('نظر شما ثبت شد')
          reset({ rating: 0, comment: '' })
        },
        onError: (error) => {
          if (!applyServerErrors(error, setError)) toast.error(error.message || 'ثبت نظر انجام نشد')
        },
      }),
    [mutate, reset, setError],
  )

  return (
    <form
      className="mb-6 grid gap-4 rounded-[20px] border border-line bg-surface p-[18px]"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h3 className="text-[16px]">نظر خود را بنویسید</h3>
      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <StarPicker value={field.value} onChange={field.onChange} error={errors.rating?.message} />
        )}
      />
      <Textarea label="نظر شما" error={errors.comment?.message} {...register('comment')} />
      <Button type="submit" loading={isPending} icon={<Send size={18} />} className="justify-self-start">
        ثبت نظر
      </Button>
    </form>
  )
})

export default ReviewForm
