import { HttpMethod } from '@oats-ts/openapi-http'

export type CorsConfiguration = {
  allowedOrigins: string[] | true
  isRequestHeaderAllowed?: (path: string, header: string) => boolean
  isResponseHeaderAllowed?: (path: string, header: string) => boolean
  isMethodAllowed?: (path: string, method: HttpMethod) => boolean
}

export type ExpressRoutersGeneratorConfig = {
  /** The key of the configuration object shared across Routes. It has to be added on response.locals. */
  adapterKey: string
  /** The key of the api implementation object shared across Routes. It has to be added on response.locals. */
  apiKey: string
  /**
   * CORS configuration.
   * If false, CORS headers will not be handled
   * If true, any origin is allowed, and handled
   * If a string array (accepted origins), only these origins will be allowed, and handled
   */
  cors: false | CorsConfiguration
}
