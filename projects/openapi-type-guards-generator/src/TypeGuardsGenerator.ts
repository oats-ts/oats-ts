import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { JsonSchemaTypeGuardsGenerator } from '@oats-ts/json-schema-type-guards-generator'

export class TypeGuardsGenerator extends JsonSchemaTypeGuardsGenerator<OpenAPIReadOutput> {
  public readonly id: string = 'openapi/typeGuards'
  public readonly produces: [OpenAPIGeneratorTarget] = ['openapi/type-guard']
  public readonly consumes: [OpenAPIGeneratorTarget] = ['openapi/type']
}
