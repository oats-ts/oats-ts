import { OperationDefaultLocals } from './OperationNames'

export type OperationsGeneratorConfig = {
  /**
   * If set to true, the summary, description and deprecated fields in OperationObjects will be used
   * to generate documentation for the generated methods. Otherwise docs will be omitted.
   */
  documentation: boolean
  /**
   * If set to true, response headers and response bodies will be validated by the operations.
   * This works well to detect if the backend has steered away from the OpenAPI spec, or if
   * the spec you generate from is out of sync with the backend.
   */
  validate: boolean
  /**
   * If set to true, the Cookie header will be manually sent, otherwise it will be ignored.
   */
  sendCookieHeader: boolean
  /**
   * If set to true, the Set-Sookie header(s) will be parsed, otherwise they will be ignored.
   */
  parseSetCookieHeaders: boolean
}

export type OperationLocals = keyof typeof OperationDefaultLocals
