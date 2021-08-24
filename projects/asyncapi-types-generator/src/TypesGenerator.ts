import {
  JsonSchemaTypesGenerator,
  TypesGeneratorConfig,
  TypesGeneratorContext,
} from '@oats-ts/json-schema-types-generator'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { createAsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getNamedSchemas, getDiscriminators, getReferencedNamedSchemas } from '@oats-ts/model-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export class TypesGenerator extends JsonSchemaTypesGenerator<AsyncAPIReadOutput> {
  public readonly id = 'openapi/types'
  public readonly consumes: AsyncAPIGeneratorTarget[] = []
  public readonly produces: AsyncAPIGeneratorTarget[] = ['asyncapi/type']

  createContext(
    config: GeneratorConfig & TypesGeneratorConfig,
    data: AsyncAPIReadOutput,
    generators: CodeGenerator<AsyncAPIReadOutput, TypeScriptModule>[],
  ): TypesGeneratorContext {
    const context = createAsyncAPIGeneratorContext(data, config, generators)
    return {
      target: 'openapi/type',
      schemas: getNamedSchemas(context),
      dereference: context.dereference,
      nameOf: context.nameOf,
      pathOf: context.pathOf,
      discriminatorsOf: (schema: Referenceable<SchemaObject>) => getDiscriminators(schema, context),
      namedReferencesOf: (schema: Referenceable<SchemaObject>) => getReferencedNamedSchemas(schema, context),
    }
  }
}
