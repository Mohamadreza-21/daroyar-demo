import { cn } from '../../utils/format'

export const chipClass = (active, className) =>
  cn(
    'inline-flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] px-4 text-[13.5px] font-bold [transition:all_0.2s]',
    active
      ? 'border-primary bg-primary text-white'
      : 'border-line bg-surface text-ink-2 hover:border-primary hover:text-primary-700',
    className,
  )

export const CHIP_SM = 'min-h-9 px-3.5 text-[13px]'

export const CHECK_LABEL =
  'flex cursor-pointer items-start gap-2.5 text-[13.5px] text-ink-2 [&_a]:font-bold [&_a]:text-primary-700'
export const CHECK_INPUT = 'mt-[3px] size-[19px] shrink-0 accent-primary'

export const PAGEHEAD =
  'mb-[22px] flex flex-wrap items-center justify-between gap-4 [&_h1]:text-[clamp(22px,3.2vw,32px)]'

export const SEARCHFIELD = 'relative flex w-[min(100%,360px)] items-center'
export const SEARCH_ICON = 'absolute start-3.5 text-muted'
export const SEARCH_INPUT =
  'h-[46px] w-full py-px rounded-[14px] border-[1.5px] border-line bg-surface ps-11 pe-10 outline-none focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_14%,transparent)]'
export const SEARCH_CLEAR = 'absolute end-2.5 grid size-7 place-items-center rounded-full text-muted hover:bg-bg-2'

export const MINI_SELECT = 'h-10 rounded-[12px] border-[1.5px] border-line bg-surface px-3 font-bold outline-none'

export const DEMO_NOTE = 'mb-4 rounded-[12px] bg-[#fff7e0] px-3.5 py-2.5 text-[0.9rem] text-[#6b4e00]'

export const CARD = 'rounded-lg border border-line bg-surface p-6 shadow-sm'
export const CARD_TITLE = 'mb-[18px] text-[17px]'
export const CARD_ROW = 'flex flex-wrap items-center justify-between gap-3'
export const STACK = 'grid grid-cols-[minmax(0,1fr)] content-start gap-[18px]'
export const FORM_GRID = 'grid grid-cols-2 items-start gap-4 max-[561px]:grid-cols-1'
export const FIELD_ERROR = 'text-[12.5px] font-semibold text-danger'

export const CART_LAYOUT = 'grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6 pb-5 max-[1025px]:grid-cols-1'
export const CART_SIDE = 'sticky top-[calc(var(--header-h)+16px)] grid gap-3.5 max-[1025px]:static'

export const SPEC_ROW = 'flex justify-between gap-4 border-b border-dashed border-line py-3'
export const SPEC_DT = 'text-muted'
export const SPEC_DD = 'm-0 font-bold'

export const OLIST = 'grid gap-1'
export const OLIST_LI =
  'grid grid-cols-[1.1fr_1fr_1fr_auto] items-center gap-2.5 border-b border-dashed border-line py-3 text-[14px] last:border-b-0 max-[561px]:grid-cols-[1fr_1fr]'
export const TWO = 'grid grid-cols-2 gap-4 max-[1025px]:grid-cols-1'

export const LINK_MORE = 'inline-flex items-center gap-1.5 font-extrabold text-primary-700'
export const PANEL_TITLE = 'text-[clamp(20px,2.6vw,26px)]'

export const WELCOME =
  'flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[linear-gradient(120deg,#0b8576,#12b5a0)] p-[clamp(20px,3vw,32px)] text-white'
export const STATGRID = 'grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5'
export const STAT_TONES = {
  teal: '[--tone:var(--color-primary)] [--tone-bg:var(--color-primary-50)]',
  coral: '[--tone:var(--color-accent-600)] [--tone-bg:var(--color-accent-50)]',
  indigo: '[--tone:var(--color-indigo)] [--tone-bg:var(--color-indigo-50)]',
  amber: '[--tone:var(--color-warn)] [--tone-bg:var(--color-warn-50)]',
}
export const STAT =
  'flex items-center gap-3.5 rounded-[22px] border border-line bg-surface p-[18px] [transition:transform_0.25s,translate_0.25s,rotate_0.25s,scale_0.25s,box-shadow_0.25s] hover:[transform:translateY(-3px)] hover:shadow-sm'
export const STAT_ICON = 'grid size-[50px] shrink-0 place-items-center rounded-2xl bg-(--tone-bg) text-(--tone)'

export const TOOLBAR_SORT = 'flex items-center gap-2 text-[13.5px] text-muted'
export const ADMIN_FILTERS = 'flex flex-wrap items-center gap-3'
export const ADMIN_SEARCH = `${SEARCHFIELD} flex-[1_1_240px]`

export const TABLE_WRAP = 'overflow-x-auto rounded-lg border border-line bg-surface'
export const TABLE = 'w-full min-w-[640px] border-collapse text-[14px]'
export const TH = 'whitespace-nowrap bg-bg px-4 py-3.5 text-start text-[12.5px] font-extrabold text-muted'
export const TR = '[transition:background_0.15s] hover:bg-[color-mix(in_srgb,var(--color-primary-50)_55%,transparent)]'
export const TD = 'border-t border-line px-4 py-3 align-middle'
export const CELL_USER = 'flex min-w-0 items-center gap-3'
export const CELL_USER_NAME = 'block leading-[1.4]'
export const THUMB = 'size-12 shrink-0 rounded-[12px] bg-bg-2 object-contain'
export const ROW_ACTIONS = 'flex gap-1'

export const FORM_ACTIONS = 'mt-5 flex justify-end gap-2.5'
