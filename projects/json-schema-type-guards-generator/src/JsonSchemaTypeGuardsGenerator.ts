import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { isNil, negate, sortBy } from 'lodash'
import { getNamedSchemas, ReadOutput, createGeneratorContext, HasSchemas } from '@oats-ts/model-common'
import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig } from './typings'
import { ImportDeclaration, Identifier, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'

export class JsonSchemaTypeGuardsGenerator<T extends ReadOutput<HasSchemas>>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: JsonSchemaGeneratorContext = null
  public readonly id: JsonSchemaGeneratorTarget = 'json-schema/type-guard'
  public readonly consumes: JsonSchemaGeneratorTarget[] = ['json-schema/type']

  constructor(private readonly config: TypeGuardGeneratorConfig) {}

  initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = createGeneratorContext(data, config, generators)
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { uriOf, nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, 'json-schema/type-guard')).filter(
      (schema) => !config.ignore(schema, uriOf(schema)),
    )
    const data = mergeTypeScriptModules(
      schemas.map((schema) => generateTypeGuard(schema, context, config)).filter(negate(isNil)),
    )
    // TODO maybe try catch
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  referenceOf(input: any): Identifier {
    const { context } = this
    // TODO does it make sense to generate the assertion AST for non named type?
    // We lose the type guard nature at that point.
    const { nameOf } = context
    return isNil(nameOf(input)) ? undefined : factory.createIdentifier(nameOf(input, this.id))
  }

  dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
