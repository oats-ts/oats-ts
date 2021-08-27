import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { JsonSchemaValidatorsGenerator } from '@oats-ts/json-schema-validators-generator'

export class ValidatorsGenerator extends JsonSchemaValidatorsGenerator<OpenAPIReadOutput> {
  public readonly id: string = 'openapi/validators'
  public readonly produces: [OpenAPIGeneratorTarget] = ['openapi/validator']
  public readonly consumes: [OpenAPIGeneratorTarget] = ['openapi/type']
}
