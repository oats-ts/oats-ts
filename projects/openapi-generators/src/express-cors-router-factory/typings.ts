import { HttpMethod } from '@oats-ts/openapi-http'
import { OperationObject } from '@oats-ts/openapi-model'

export type ExpressCorsRouterFactoryGeneratorConfig = {
  isRequestHeaderAllowed: (path: string, header: string, operation: OperationObject) => boolean
  isResponseHeaderAllowed: (path: string, header: string, operation: OperationObject) => boolean
  isMethodAllowed: (path: string, method: HttpMethod, operation: OperationObject) => boolean
  getMaxAge: (path: string, method: HttpMethod, operation: OperationObject) => number | undefined
  getAllowedOrigins: (path: string, method: HttpMethod, operation: OperationObject) => string[] | boolean
  isCredentialsAllowed: (path: string, method: HttpMethod, operation: OperationObject) => boolean | undefined
}
