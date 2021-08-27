import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeNode, ImportDeclaration } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy } from 'lodash'
import { GeneratorConfig, Result, CodeGenerator } from '@oats-ts/generator'
import {
  createGeneratorContext,
  GeneratorContext,
  getNamedSchemas,
  HasSchemas,
  ReadOutput,
} from '@oats-ts/model-common'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { generateType } from './generateType'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'

export abstract class JsonSchemaTypesGenerator<T extends ReadOutput<HasSchemas>>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: TypesGeneratorContext = null
  private config: GeneratorConfig & TypesGeneratorConfig
  public readonly consumes: string[] = []

  abstract readonly id: string
  abstract readonly produces: [string]

  public constructor(config: GeneratorConfig & TypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: T, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = {
      ...createGeneratorContext(data, this.config, generators),
      target: this.produces[0],
    }
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
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

  public referenceOf(input: Referenceable<SchemaObject>, target: string): TypeNode {
    const { context, config } = this
    switch (target) {
      case context.target:
        return getExternalTypeReferenceAst(input, context, config)
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>, target: string): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case context.target:
        return getTypeImports(fromPath, input, context, true)
      default:
        return []
    }
  }
}
