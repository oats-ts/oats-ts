import { JsonSchemaTypesGenerator } from '@oats-ts/json-schema-types-generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

export class TypesGenerator extends JsonSchemaTypesGenerator<OpenAPIReadOutput> {
  public readonly id = 'openapi/types'
  public readonly target: OpenAPIGeneratorTarget = 'openapi/type'
  public readonly consumes: OpenAPIGeneratorTarget[] = []
  public readonly produces: OpenAPIGeneratorTarget[] = ['openapi/type']
}
