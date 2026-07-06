const jsonHeaders = {
  'Content-Type': 'application/json',
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders,
  })
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function handleContactRequest(request, env, fetcher = fetch) {
  let body

  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request body.' }, 400)
  }

  const name = normalizeField(body.name)
  const phone = normalizeField(body.phone)
  const email = normalizeField(body.email)

  if (!name || !phone || !email) {
    return json({ error: 'All fields are required.' }, 400)
  }

  if (!isValidEmail(email)) {
    return json({ error: 'Invalid email address.' }, 400)
  }

  const apiKey = env?.RESEND_API_KEY
  const contactEmail = env?.CONTACT_EMAIL

  if (!apiKey || !contactEmail) {
    return json({ error: 'Email service is not configured.' }, 500)
  }

  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'elianrc.com <noreply@elianrc.com>',
      to: [contactEmail],
      subject: `New contact from ${name.replace(/\s+/g, ' ')}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}`,
    }),
  })

  if (!response.ok) {
    return json({ error: 'Failed to send email.' }, 500)
  }

  return json({ ok: true }, 200)
}

export async function onRequestPost(context) {
  return handleContactRequest(context.request, context.env)
}
