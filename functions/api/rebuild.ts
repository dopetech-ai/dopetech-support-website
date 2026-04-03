interface Env {
  REBUILD_SECRET: string
  GITHUB_TOKEN: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { REBUILD_SECRET, GITHUB_TOKEN } = context.env

  // Verify the shared secret from the query param or header
  const url = new URL(context.request.url)
  const secret = url.searchParams.get('secret') || context.request.headers.get('X-Rebuild-Secret')

  if (!REBUILD_SECRET || secret !== REBUILD_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!GITHUB_TOKEN) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Trigger GitHub repository_dispatch
  const res = await fetch(
    'https://api.github.com/repos/dopetech-ai/dopetech-support-website/dispatches',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'dopetech-support-webhook',
      },
      body: JSON.stringify({ event_type: 'notion-content-update' }),
    },
  )

  if (!res.ok) {
    const body = await res.text()
    return new Response(JSON.stringify({ error: 'GitHub dispatch failed', detail: body }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, message: 'Rebuild triggered' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
