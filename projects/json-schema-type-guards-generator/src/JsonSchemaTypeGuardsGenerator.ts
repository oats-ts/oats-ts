import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { isNil, negate, sortBy } from 'lodash'
import { getNamedSchemas, ReadOutput, createGeneratorContext, HasSchemas } from '@oats-ts/model-common'
import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { ImportDeclaration, Identifier, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export abstract class JsonSchemaTypeGuardsGenerator<
  T extends ReadOutput<HasSchemas>,
  Id extends string,
  C extends string,
> implements CodeGenerator<T, TypeScriptModule>
{
  private context: TypeGuardGeneratorContext = null
  private typeGuardsConfig: TypeGuardGeneratorConfig

  public abstract readonly id: Id
  public abstract readonly consumes: [C]

  constructor(config: TypeGuardGeneratorConfig) {
    this.typeGuardsConfig = config
  }

  initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = {
      ...createGeneratorContext(data, config, generators),
      consumes: this.consumes[0],
      produces: this.id,
    }
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, typeGuardsConfig: config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, context.produces))
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
