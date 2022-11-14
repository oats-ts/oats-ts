import { Issue } from '@oats-ts/validators'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { JsonSchemaBasedGeneratorContext } from '@oats-ts/model-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export type OpenAPIValidator = {
  validate(input: OpenAPIObject): Issue[]
}

export type OpenAPIValidatorConfig = {
  validator: OpenAPIValidator
}

export type OpenAPIValidatorContext = JsonSchemaBasedGeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget> & {
  readonly validated: Set<any>
}
