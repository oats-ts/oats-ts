export type ExpressRoutesGeneratorConfig = {
  /** The key of the configuration object shared across Routes. It has to be added on response.locals. */
  adapterKey: string
  /** The key of the api implementation object shared across Routes. It has to be added on response.locals. */
  apiKey: string
}
