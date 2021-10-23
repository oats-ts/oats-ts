import { JsonSchemaTypesGenerator } from '@oats-ts/json-schema-types-generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

export class TypesGenerator extends JsonSchemaTypesGenerator<
  OpenAPIReadOutput,
  'openapi/type',
  OpenAPIGeneratorTarget
> {
  public readonly id = 'openapi/type'
  public readonly produces: [OpenAPIGeneratorTarget] = ['openapi/type']
}
