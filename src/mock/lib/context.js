import { fail } from './errors.js'

const TTL_MINUTES = 120

export const publicUser = (user) => {
  if (!user) return null
  const { passwordHash: _hash, ...rest } = user
  return rest
}

export function createSession(db, userId) {
  const token = [...crypto.getRandomValues(new Uint8Array(32))]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  const expiresAt = new Date(Date.now() + TTL_MINUTES * 60_000).toISOString()
  db.sessions.push({ id: token, userId, expiresAt })
  return { token, expiresAt }
}

export function resolveSession(db, header) {
  const token = String(header ?? '').startsWith('Bearer ') ? header.slice(7).trim() : null
  const result = { token, user: null, sessionExpired: false }
  if (!token) return result
  const index = db.sessions.findIndex((session) => session.id === token)
  const session = db.sessions[index]
  if (!session || new Date(session.expiresAt) <= new Date()) {
    if (session) db.sessions.splice(index, 1)
    return { ...result, sessionExpired: true }
  }
  const user = db.users.find((item) => item.id === session.userId) ?? null
  return { ...result, user, sessionExpired: !user }
}

export function requireUser(ctx) {
  if (ctx.user) return ctx.user
  if (ctx.sessionExpired) fail(401, 'نشست شما منقضی شده است؛ دوباره وارد شوید.', { code: 'SESSION_EXPIRED' })
  return fail(401, 'برای ادامه وارد حساب کاربری شوید.', { code: 'UNAUTHENTICATED' })
}

export function requireAdmin(ctx) {
  const user = requireUser(ctx)
  if (user.role !== 'admin') fail(403, 'اجازهٔ دسترسی به این بخش را ندارید.', { code: 'FORBIDDEN' })
  return user
}

export function paginate(items, query, defaultLimit = 10) {
  const page = Math.max(1, parseInt(query._page, 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query._limit, 10) || defaultLimit))
  return { page, limit, total: items.length, items: items.slice((page - 1) * limit, page * limit) }
}

export const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1

export const respond = (data, { status = 200, total } = {}) => ({
  status,
  data,
  headers: total == null ? {} : { 'x-total-count': String(total) },
})
