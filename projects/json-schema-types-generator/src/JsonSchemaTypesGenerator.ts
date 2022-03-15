import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { TypeNode, ImportDeclaration } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy } from 'lodash'
import { GeneratorConfig, Result, CodeGenerator } from '@oats-ts/generator'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { TypesGeneratorConfig } from './typings'
import { generateType } from './generateType'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'

export class JsonSchemaTypesGenerator<T extends ReadOutput<HasSchemas>> implements CodeGenerator<T, TypeScriptModule> {
  private context: JsonSchemaGeneratorContext = null

  public readonly id: JsonSchemaGeneratorTarget = 'json-schema/type'
  public readonly consumes: JsonSchemaGeneratorTarget[] = []
  public readonly runtimeDepencencies: string[] = []

  public constructor(private readonly config: TypesGeneratorConfig) {}

  public initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = createGeneratorContext(data, config, generators)
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

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    const { context, config } = this
    return getExternalTypeReferenceAst(input, context, config)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    const { context } = this
    return getTypeImports(fromPath, input, context, true)
  }
}
