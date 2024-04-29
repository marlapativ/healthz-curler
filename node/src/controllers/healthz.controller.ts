import express from 'express'

const healthzRouter = express.Router()
healthzRouter.get('/', (_, res) => res.status(200).send())

export { healthzRouter }
