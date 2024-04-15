import Elysia from 'elysia'

const routes = (server: Elysia<'/api/v1'>) => {
  return server.get('/hello', () => {
    'Hello, World!'
  })
}
export { routes }
