const getApiUrl = (path?: string) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://localhost'
  return `${SERVER_URL}${path}`
}

const fakeResponse: Record<string, unknown> = {
  '/api/v1/config/aggregate': [
    {
      id: 'bun-elysia',
      runtime: 'bun',
      apiVersion: 'v1',
      server: {
        port: '4205',
        framework: 'Elysia'
      },
      websocket: [
        {
          name: 'bun',
          path: '/ws',
          port: '4205'
        },
        {
          name: 'bun-socket.io',
          path: '/socket.io',
          port: '4206'
        }
      ]
    }
  ]
}

export function fetchApi(path: string, init?: RequestInit): Promise<Response> {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => resolve(null), 1000)
    }).then(() => {
      if (path && fakeResponse[path]) return new Response(JSON.stringify(fakeResponse[path]))
      return fetch(`http://localhost:4205${path}`, init)
    })
  } else {
    return fetch(getApiUrl(path), init)
  }
}
