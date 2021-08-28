import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'
import { JsonSchemaTypeGuardsGenerator } from '@oats-ts/json-schema-type-guards-generator'

export class TypeGuardsGenerator extends JsonSchemaTypeGuardsGenerator<AsyncAPIReadOutput> {
  public readonly id: string = 'asyncapi/typeGuards'
  public readonly produces: [AsyncAPIGeneratorTarget] = ['asyncapi/type-guard']
  public readonly consumes: [AsyncAPIGeneratorTarget] = ['asyncapi/type']
}
