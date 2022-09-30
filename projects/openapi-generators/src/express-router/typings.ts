import { HttpMethod } from '@oats-ts/openapi-http'
import { OperationObject } from '@oats-ts/openapi-model'

export type ExpressRoutersGeneratorConfig = {
  getAllowedOrigins: (path: string, method: HttpMethod, operation: OperationObject) => string[] | boolean
  isResponseHeaderAllowed: (path: string, header: string, operation: OperationObject) => boolean
  isCredentialsAllowed: (path: string, method: HttpMethod, operation: OperationObject) => boolean | undefined
}
