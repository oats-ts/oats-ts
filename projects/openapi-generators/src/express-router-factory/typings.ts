import { HttpMethod } from '@oats-ts/openapi-http'
import { OperationObject } from '@oats-ts/openapi-model'

export type ExpressRouterFactoriesGeneratorConfig = {
  /**
   * Returns the allowed origins for the given parameters.
   * - In case it returns an array of strings, these will be considered as allowed origins.
   * - In case it returns a boolean, either all origins will be accepted or rejected (use this with caution)
   * This influences the Access-Control-Allow-Origin CORS header.
   * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
   */
  getAllowedOrigins(path: string, method: HttpMethod, operation: OperationObject): string[] | boolean
  /**
   * Returns if the give response header should be exposed to browser clients.
   * This influences the Access-Control-Expose-Headers CORS header.
   * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
   */
  isResponseHeaderAllowed(header: string, path: string, method: HttpMethod, operation: OperationObject): boolean
  /**
   * Returns if cookies and authorization headers should be exposed for the given path and method combination.
   * This influences the Access-Control-Allow-Credentials CORS header.
   * Docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
   */
  isCredentialsAllowed(path: string, method: HttpMethod, operation: OperationObject): boolean | undefined
}
