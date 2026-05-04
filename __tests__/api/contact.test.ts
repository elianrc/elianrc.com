import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/contact/route'

vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return {
      emails: {
        send: vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null }),
      },
    }
  }),
}))

function makeRequest(body: Record<string, string>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ name: '', phone: '123', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when phone is missing', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is invalid', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '123', email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 200 when all fields are valid', async () => {
    const res = await POST(makeRequest({ name: 'Test', phone: '123', email: 'test@example.com' }))
    expect(res.status).toBe(200)
  })
})
