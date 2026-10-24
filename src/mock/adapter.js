import axios from 'axios'
import { getDb, persist } from './db.js'
import { listCollection } from './engine.js'
import { resolveSession } from './lib/context.js'
import { toResponse } from './lib/errors.js'
import { accountRoutes } from './routes/account.js'
import { authRoutes } from './routes/auth.js'
import { catalogRoutes } from './routes/catalog.js'
import { orderRoutes } from './routes/orders.js'
import { reviewRoutes } from './routes/reviews.js'

const LATENCY_MS = 120
const BASE = 'http://mock.local'

const compile = (path) => new RegExp(`^${path.replace(/:(\w+)/g, '(?<$1>[^/]+)')}$`)
const ROUTES = [...authRoutes, ...catalogRoutes, ...orderRoutes, ...reviewRoutes, ...accountRoutes].map(
  ([method, path, handler]) => ({ method, pattern: compile(path), handler }),
)

function parseQuery(searchParams) {
  const query = {}
  searchParams.forEach((value, key) => {
    query[key] = key in query ? [].concat(query[key], value) : value
  })
  return query
}

function parseBody(data) {
  if (typeof data !== 'string' || !data) return data ?? {}
  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}

const wait = (signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new axios.CanceledError('canceled'))
      return
    }
    const timer = setTimeout(resolve, LATENCY_MS)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new axios.CanceledError('canceled'))
    })
  })

async function dispatch(config) {
  const url = new URL(axios.getUri(config), BASE)
  const path = url.pathname.replace(/^\/api/, '') || '/'
  const method = config.method.toUpperCase()
  const db = await getDb()
  const session = resolveSession(db, config.headers?.get?.('Authorization') ?? config.headers?.Authorization)
  const ctx = { db, query: parseQuery(url.searchParams), body: parseBody(config.data), ...session, params: {} }

  for (const route of ROUTES) {
    const match = route.method === method && route.pattern.exec(path)
    if (match) {
      ctx.params = { ...match.groups }
      Object.keys(ctx.params).forEach((key) => {
        ctx.params[key] = decodeURIComponent(ctx.params[key])
      })
      return route.handler(ctx)
    }
  }
  if (method === 'GET') {
    const collection = path.split('/')[1]
    const result = listCollection(collection, db[collection], ctx.query)
    if (result && path.split('/').length === 2) return result
  }
  return { status: 404, data: { message: 'مسیر درخواستی پیدا نشد' }, headers: {} }
}

export async function mockAdapter(config) {
  await wait(config.signal)
  let result
  try {
    result = await dispatch(config)
    if (config.method.toUpperCase() !== 'GET') persist()
  } catch (error) {
    result = { ...toResponse(error), headers: {} }
    if (result.status === 500) console.error(error)
  }
  const response = { ...result, statusText: '', config, request: {} }
  if (result.status >= 400) {
    throw new axios.AxiosError(result.data.message, 'ERR_BAD_REQUEST', config, {}, response)
  }
  return response
}
