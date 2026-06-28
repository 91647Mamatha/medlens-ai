export function formatDate(value) {
  if (!value) return 'Unknown date'

  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

export function safeText(value, fallback = 'Not available') {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

export function parseEntities(value) {
  if (!value) return []

  if (Array.isArray(value)) return value

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}