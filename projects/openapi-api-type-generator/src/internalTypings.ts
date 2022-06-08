import { EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export type ApiTypeGeneratorItem = {
  document: OpenAPIObject
  operations: EnhancedOperation[]
}
