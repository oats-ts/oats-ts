import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { JsonSchemaValidatorsGenerator } from '@oats-ts/json-schema-validators-generator'

export class ValidatorsGenerator extends JsonSchemaValidatorsGenerator<
  OpenAPIReadOutput,
  'openapi/validator',
  OpenAPIGeneratorTarget
> {
  public readonly id = 'openapi/validator'
  public readonly consumes: [OpenAPIGeneratorTarget] = ['openapi/type']
}
