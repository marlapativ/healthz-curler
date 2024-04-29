declare global {
  interface IContainer {
    init: () => Promise<void>
    get: <T>(key: string) => T
  }

  type Context = {
    decorator: {}
    store: {
      container: IContainer
    }
    derive: {}
    resolve: {}
  }
}

export {}
