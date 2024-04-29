import Elysia from 'elysia'

const healthzRouter = () => {
  return new Elysia<'/healthz', false, Context>({ prefix: '/healthz', tags: ['healthz'] }).get('', () => {})
}

export { healthzRouter }
