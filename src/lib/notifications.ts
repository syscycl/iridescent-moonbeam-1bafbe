// Formspree notification service - FREE, sends email to manager@syscycl.com
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnjyngrb'

interface NotificationData {
  type: 'registration' | 'chat' | 'sponsor'
  name: string
  phone: string
  email?: string
  message?: string
  details?: string
  timestamp: string
}

export async function sendNotification(data: NotificationData): Promise<boolean> {
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `Syscycl Alert: New ${data.type.toUpperCase()} - ${data.name}`,
        _replyto: data.email || 'noreply@syscycl.com',
        type: data.type,
        name: data.name,
        phone: data.phone,
        email: data.email || 'Not provided',
        message: data.message || data.details || '',
        timestamp: data.timestamp,
        source: 'syscycl.com',
      }),
    })

    return response.ok
  } catch {
    // Silently fail - don't block user experience
    return false
  }
}

export function getCurrentTimestamp(): string {
  return new Date().toLocaleString('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
