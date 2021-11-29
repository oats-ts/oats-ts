import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeNode, ImportDeclaration } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy } from 'lodash'
import { GeneratorConfig, Result, CodeGenerator } from '@oats-ts/generator'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { generateType } from './generateType'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'

export abstract class JsonSchemaTypesGenerator<T extends ReadOutput<HasSchemas>, Id extends string, C extends string>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: TypesGeneratorContext = null
  private jsonSchemaConfig: TypesGeneratorConfig
  public readonly consumes: C[] = []
  abstract readonly id: Id

  public constructor(config: TypesGeneratorConfig) {
    this.jsonSchemaConfig = config
  }

  public initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = {
      ...createGeneratorContext(data, config, generators),
      target: this.id,
    }
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, jsonSchemaConfig: config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema))
    const data = mergeTypeScriptModules(
      schemas.map((schema): TypeScriptModule => generateType(schema, context, config)),
    )
    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    const { context, jsonSchemaConfig: config } = this
    return getExternalTypeReferenceAst(input, context, config)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    const { context } = this
    return getTypeImports(fromPath, input, context, true)
  }
}
