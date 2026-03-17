interface Env {
  NOTION_API_KEY: string
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  try {
    const body = (await context.request.json()) as {
      articleId?: string
      helpful?: boolean
    }

    const { articleId, helpful } = body
    if (!articleId || typeof helpful !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Missing articleId or helpful' }),
        { status: 400, headers },
      )
    }

    const notionKey = context.env.NOTION_API_KEY
    if (!notionKey) {
      return new Response(
        JSON.stringify({ error: 'Server misconfigured' }),
        { status: 500, headers },
      )
    }

    // First, read the current value of the property
    const pageRes = await fetch(
      `https://api.notion.com/v1/pages/${articleId}`,
      {
        headers: {
          Authorization: `Bearer ${notionKey}`,
          'Notion-Version': '2022-06-28',
        },
      },
    )

    if (!pageRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Article not found' }),
        { status: 404, headers },
      )
    }

    const page = (await pageRes.json()) as {
      properties: Record<string, { type: string; number: number | null }>
    }

    const prop = helpful ? 'Helpful' : 'Not Helpful'
    const currentValue = page.properties[prop]?.number ?? 0

    // Increment the counter
    const updateRes = await fetch(
      `https://api.notion.com/v1/pages/${articleId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${notionKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            [prop]: { number: currentValue + 1 },
          },
        }),
      },
    )

    if (!updateRes.ok) {
      const errText = await updateRes.text()
      console.error('Notion update error:', errText)
      return new Response(
        JSON.stringify({ error: 'Failed to record feedback' }),
        { status: 500, headers },
      )
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
  } catch (err) {
    console.error('Feedback error:', err)
    return new Response(
      JSON.stringify({ error: 'Something went wrong' }),
      { status: 500, headers },
    )
  }
}

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
