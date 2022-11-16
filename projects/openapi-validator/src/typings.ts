import { OpenAPIObject } from '@oats-ts/openapi-model'
import { JsonSchemaBasedGeneratorContext } from '@oats-ts/model-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export type OpenAPIValidatorContext = JsonSchemaBasedGeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget> & {
  readonly validated: Set<any>
}
