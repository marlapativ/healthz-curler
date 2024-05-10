export const getApiUrl = (path?: string) => {
  const apiUrl = 'https://localhost:3000/api/v1'
  return `${apiUrl}${path}`
}

const fakeResponse: Record<string, unknown> = {
  '/api/v1/config': [
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
    },
    {
      id: 'node-express',
      runtime: 'node',
      apiVersion: 'v1',
      server: {
        port: '4215',
        framework: 'Express'
      },
      websocket: [
        {
          name: 'node',
          path: '/ws',
          port: '4215'
        },
        {
          name: 'node-socket.io',
          path: '/socket.io',
          port: '4216'
        }
      ]
    },
    {
      id: 'go-fiber',
      runtime: 'go',
      apiVersion: 'v1',
      server: {
        port: '4225',
        framework: 'fiber'
      },
      websocket: [
        {
          name: 'go',
          path: '/ws',
          port: '4225'
        }
      ]
    }
  ]
}

export function fetchApi(path?: string, init?: RequestInit): Promise<Response> {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    if (path) {
      return Promise.resolve(new Response(JSON.stringify(fakeResponse[path])))
    }
    return Promise.resolve(new Response())
  } else {
    return fetch(getApiUrl(path), init)
  }
}