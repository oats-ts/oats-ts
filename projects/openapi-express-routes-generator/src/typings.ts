export type ExpressRouteGeneratorConfig = {
  /** The key of the configuration object shared across Routes. It has to be added on response.locals. */
  configurationKey: string
  /** The key of the api implementation object shared across Routes. It has to be added on response.locals. */
  apiImplKey: string
}
