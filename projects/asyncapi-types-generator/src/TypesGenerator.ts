import { JsonSchemaTypesGenerator } from '@oats-ts/json-schema-types-generator'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'

export class TypesGenerator extends JsonSchemaTypesGenerator<
  AsyncAPIReadOutput,
  'asyncapi/type',
  AsyncAPIGeneratorTarget
> {
  public readonly id = 'asyncapi/type'
}
