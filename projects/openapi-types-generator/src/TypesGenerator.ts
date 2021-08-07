import {
  JsonSchemaTypesGenerator,
  TypesGeneratorConfig,
  TypesGeneratorContext,
} from '@oats-ts/json-schema-types-generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import {
  getNamedSchemas,
  createOpenAPIGeneratorContext,
  getDiscriminators,
  getReferencedNamedSchemas,
} from '@oats-ts/openapi-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'

export class TypesGenerator extends JsonSchemaTypesGenerator<OpenAPIReadOutput> {
  public readonly id = 'openapi/types'
  public readonly consumes: OpenAPIGeneratorTarget[] = []
  public readonly produces: OpenAPIGeneratorTarget[] = ['openapi/type']

  createContext(
    config: GeneratorConfig & TypesGeneratorConfig,
    data: OpenAPIReadOutput,
    generators: CodeGenerator<OpenAPIReadOutput, TypeScriptModule>[],
  ): TypesGeneratorContext {
    const context = createOpenAPIGeneratorContext(data, config, generators)
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
