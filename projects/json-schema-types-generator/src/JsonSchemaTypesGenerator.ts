import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeNode, ImportDeclaration } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy } from 'lodash'
import { GeneratorConfig, Result, CodeGenerator } from '@oats-ts/generator'
import { TypesGeneratorConfig, TypesGeneratorContext } from './typings'
import { generateType } from './generateType'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'

export abstract class JsonSchemaTypesGenerator<T> implements CodeGenerator<T, TypeScriptModule> {
  private context: TypesGeneratorContext = null
  private config: GeneratorConfig & TypesGeneratorConfig

  abstract readonly id: string
  abstract readonly produces: string[]
  abstract readonly consumes: string[]

  abstract createContext(
    config: GeneratorConfig & TypesGeneratorConfig,
    data: T,
    generators: CodeGenerator<T, TypeScriptModule>[],
  ): TypesGeneratorContext

  public constructor(config: GeneratorConfig & TypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: T, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = this.createContext(this.config, data, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const schemas = sortBy(context.schemas, (schema) => nameOf(schema))
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
