import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export type GeneratorItem = {
  document: OpenAPIObject
  operations: EnhancedOperation[]
}
