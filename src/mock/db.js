import { syncAllRatings } from './lib/rating.js'

const STORAGE_KEY = 'darooyar-demo-db-v2'

let state = null

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function getDb() {
  if (state) return state
  state = readStored()
  if (!state) {
    const { default: seed } = await import('./seed.json')
    state = structuredClone(seed)
  }
  syncAllRatings(state)
  return state
}

export function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    return
  }
}

export function resetDemoData() {
  try {
    localStorage.clear()
  } catch {
    return
  }
  state = null
}
