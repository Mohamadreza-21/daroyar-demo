const encoder = new TextEncoder()

const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

async function digest(salt, password) {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${password}`)))
}

export async function hashPassword(password) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  return `sha256$${salt}$${await digest(salt, password)}`
}

export async function verifyPassword(password, stored) {
  const [scheme, salt, hash] = String(stored ?? '').split('$')
  if (scheme !== 'sha256' || !salt || !hash) return false
  return (await digest(salt, password)) === hash
}
