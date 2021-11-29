import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { JsonSchemaTypeGuardsGenerator } from '@oats-ts/json-schema-type-guards-generator'
import { OpenAPIGenerator, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export class TypeGuardsGenerator
  extends JsonSchemaTypeGuardsGenerator<OpenAPIReadOutput, 'openapi/type-guard', OpenAPIGeneratorTarget>
  implements OpenAPIGenerator<'openapi/type-guard'>
{
  public readonly id = 'openapi/type-guard'
  public readonly consumes: [OpenAPIGeneratorTarget] = ['openapi/type']
}
