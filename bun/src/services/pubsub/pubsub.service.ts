import logger from '../../config/logger'

export interface IPubSubService {
  publish<T>(channel: string, message: T): Promise<void>
  subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>
}

export class PubSubService implements IPubSubService {
  constructor() {}

  async publish<T>(channel: string, message: T): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${message}`)
  }

  async subscribe<T>(channel: string, callback: (message: T) => void): Promise<void> {
    logger.info(`PubSubService: ${channel} - ${callback}`)
  }
}
