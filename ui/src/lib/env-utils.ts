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
  ],
  '/api/v1/healthcheck': [
    {
      id: '1',
      name: 'Backend',
      description: 'Backend health check',
      url: 'http://localhost:8080/api/v1/health',
      interval: 5000,
      active: true
    },
    {
      id: '2',
      name: 'Frontend',
      description: 'Frontend health check',
      url: 'http://localhost:8081/api/v2/health',
      interval: 5000,
      active: false
    }
  ]
}

export function fetchApi(path?: string, init?: RequestInit): Promise<Response> {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    if (path) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(new Response(JSON.stringify(fakeResponse[path]))), 1000)
      })
    }
    return Promise.resolve(new Response())
  } else {
    return fetch(getApiUrl(path), init)
  }
}
