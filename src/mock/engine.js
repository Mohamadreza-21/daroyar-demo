import { buildSearchPattern } from './lib/normalize.js'
import { respond } from './lib/context.js'

const PUBLIC_COLLECTIONS = new Set(['products', 'categories', 'reviews', 'articles', 'shippingMethods'])
const MAX_PAGE_SIZE = 100
const OPERATORS = {
  _gte: (value, wanted) => Number(value) >= Number(wanted),
  _lte: (value, wanted) => Number(value) <= Number(wanted),
  _ne: (value, wanted) => String(value) !== String(wanted),
}

const asList = (value) => [].concat(value)

function matchesFilter(item, key, wanted) {
  const operator = Object.keys(OPERATORS).find((suffix) => key.endsWith(suffix))
  if (operator) return OPERATORS[operator](item[key.slice(0, -operator.length)], asList(wanted)[0])
  return asList(wanted).some((candidate) => String(item[key]) === String(candidate))
}

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''))
}

function sortItems(items, sort, order) {
  if (!sort) return items
  const fields = String(sort).split(',')
  const orders = String(order ?? '').split(',')
  return [...items].sort((a, b) => {
    for (let i = 0; i < fields.length; i += 1) {
      const result = compare(a[fields[i]], b[fields[i]])
      if (result) return orders[i] === 'desc' ? -result : result
    }
    return 0
  })
}

export function listCollection(collection, items, query) {
  if (!PUBLIC_COLLECTIONS.has(collection)) return null
  let list = items
  const pattern = collection === 'products' && typeof query.q === 'string' ? buildSearchPattern(query.q) : null
  if (pattern) {
    const regex = new RegExp(pattern, 'i')
    list = list.filter((item) => regex.test(item.searchText ?? ''))
  }
  Object.entries(query).forEach(([key, wanted]) => {
    if (key.startsWith('_') || key === 'q') return
    list = list.filter((item) => matchesFilter(item, key, wanted))
  })
  list = sortItems(list, query._sort, query._order)
  const total = list.length
  if (query._limit !== undefined) {
    const requested = Math.floor(Number(query._limit))
    const limit = Number.isFinite(requested) && requested > 0 ? Math.min(requested, MAX_PAGE_SIZE) : 10
    const page = Math.max(1, Math.floor(Number(query._page)) || 1)
    list = list.slice((page - 1) * limit, page * limit)
  }
  return respond(list, { total })
}
