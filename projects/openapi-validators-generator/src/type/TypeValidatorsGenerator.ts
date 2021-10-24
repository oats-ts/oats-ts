import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { JsonSchemaValidatorsGenerator } from '@oats-ts/json-schema-validators-generator'

export class TypeValidatorsGenerator extends JsonSchemaValidatorsGenerator<
  OpenAPIReadOutput,
  'openapi/type-validator',
  OpenAPIGeneratorTarget
> {
  public readonly id = 'openapi/type-validator'
  public readonly consumes: [OpenAPIGeneratorTarget] = ['openapi/type']
}
