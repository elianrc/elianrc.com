import { afterEach, describe, it, expect, vi } from 'vitest'
import { handleContactRequest } from '../../functions/api/contact'

const env = {
  RESEND_API_KEY: 're_test',
  CONTACT_EMAIL: 'hello@example.com',
}

function makeRequest(body: Record<string, string>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function mockFetch(response: Response = new Response('{}', { status: 200 })) {
  return vi.fn().mockResolvedValue(response)
}

describe('POST /api/contact', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when name is missing', async () => {
    const res = await handleContactRequest(
      makeRequest({ name: '', phone: '123', email: 'a@b.com' }),
      env,
      mockFetch(),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when phone is missing', async () => {
    const res = await handleContactRequest(
      makeRequest({ name: 'Test', phone: '', email: 'a@b.com' }),
      env,
      mockFetch(),
    )
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is invalid', async () => {
    const res = await handleContactRequest(
      makeRequest({ name: 'Test', phone: '123', email: 'not-an-email' }),
      env,
      mockFetch(),
    )
    expect(res.status).toBe(400)
  })

  it('sends the contact email through Resend when all fields are valid', async () => {
    const fetcher = mockFetch()

    const res = await handleContactRequest(
      makeRequest({ name: 'Test', phone: '123', email: 'test@example.com' }),
      env,
      fetcher,
    )

    expect(res.status).toBe(200)
    expect(fetcher).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer re_test',
          'Content-Type': 'application/json',
        }),
      }),
    )
  })

  it('returns 500 without calling Resend when the API key is missing', async () => {
    const fetcher = mockFetch()

    const res = await handleContactRequest(
      makeRequest({ name: 'Test', phone: '123', email: 'test@example.com' }),
      { CONTACT_EMAIL: 'hello@example.com' },
      fetcher,
    )

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ error: 'Email service is not configured.' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('returns 500 when Resend rejects the request', async () => {
    const res = await handleContactRequest(
      makeRequest({ name: 'Test', phone: '123', email: 'test@example.com' }),
      env,
      mockFetch(new Response('{}', { status: 400 })),
    )

    expect(res.status).toBe(500)
  })
})
