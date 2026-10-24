import { createSession, nextId, publicUser, requireUser, respond } from '../lib/context.js'
import { fail } from '../lib/errors.js'
import { hashPassword, verifyPassword } from '../lib/passwords.js'
import { loginSchema, parse, profileSchema, registerSchema } from '../lib/schemas.js'

const ATTEMPT_WINDOW_MS = 60_000
const MAX_ATTEMPTS = 8
const attempts = new Map()

function checkRateLimit(key) {
  const now = Date.now()
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < ATTEMPT_WINDOW_MS)
  attempts.set(key, recent)
  if (recent.length >= MAX_ATTEMPTS) fail(429, 'تعداد تلاش‌های ناموفق زیاد است؛ یک دقیقه بعد دوباره امتحان کنید.')
  return () => attempts.set(key, [...recent, now])
}

export const authRoutes = [
  [
    'POST',
    '/auth/login',
    async ({ db, body }) => {
      const { username, password } = parse(loginSchema, body)
      const key = username.toLowerCase()
      const recordFailure = checkRateLimit(key)
      const user = db.users.find((u) => u.username.toLowerCase() === key || u.email === key)
      const valid = user ? await verifyPassword(password, user.passwordHash) : false
      if (!valid) {
        recordFailure()
        fail(401, 'نام کاربری یا گذرواژه اشتباه است', { code: 'INVALID_CREDENTIALS' })
      }
      attempts.delete(key)
      return respond({ user: publicUser(user), ...createSession(db, user.id) })
    },
  ],
  [
    'POST',
    '/auth/register',
    async ({ db, body }) => {
      const { password, ...values } = parse(registerSchema, body)
      const errors = {}
      if (db.users.some((u) => u.username.toLowerCase() === values.username.toLowerCase())) {
        errors.username = 'این نام کاربری قبلاً ثبت شده است'
      }
      if (db.users.some((u) => u.email === values.email)) errors.email = 'این ایمیل قبلاً ثبت شده است'
      if (Object.keys(errors).length) fail(409, Object.values(errors)[0], { errors })
      const user = {
        id: nextId(db.users),
        ...values,
        role: 'customer',
        image: '',
        createdAt: new Date().toISOString(),
        passwordHash: await hashPassword(password),
      }
      db.users.push(user)
      return respond({ user: publicUser(user), ...createSession(db, user.id) }, { status: 201 })
    },
  ],
  [
    'POST',
    '/auth/logout',
    ({ db, token }) => {
      db.sessions = db.sessions.filter((session) => session.id !== token)
      return respond(undefined, { status: 204 })
    },
  ],
  [
    'GET',
    '/auth/me',
    (ctx) => {
      const user = requireUser(ctx)
      const session = ctx.db.sessions.find((item) => item.id === ctx.token)
      return respond({ user: publicUser(user), expiresAt: session?.expiresAt })
    },
  ],
  [
    'PATCH',
    '/auth/me',
    (ctx) => {
      const user = requireUser(ctx)
      const values = parse(profileSchema, ctx.body)
      if (ctx.db.users.some((u) => u.id !== user.id && u.email === values.email)) {
        fail(409, 'این ایمیل قبلاً برای حساب دیگری ثبت شده است', {
          errors: { email: 'این ایمیل قبلاً برای حساب دیگری ثبت شده است' },
        })
      }
      Object.assign(user, values)
      return respond({ user: publicUser(user) })
    },
  ],
]
