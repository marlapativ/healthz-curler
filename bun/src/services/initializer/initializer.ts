export interface IInitializableService {
  init(): Promise<void>
}
