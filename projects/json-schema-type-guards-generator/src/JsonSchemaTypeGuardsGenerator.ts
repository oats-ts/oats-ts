import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { isNil, negate, sortBy } from 'lodash'
import { getNamedSchemas, ReadOutput, createGeneratorContext, HasSchemas } from '@oats-ts/model-common'
import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { ImportDeclaration, Identifier, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export abstract class JsonSchemaTypeGuardsGenerator<T extends ReadOutput<HasSchemas>>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: TypeGuardGeneratorContext = null
  private config: GeneratorConfig & TypeGuardGeneratorConfig

  public abstract readonly id: string
  public abstract readonly produces: [string]
  public abstract readonly consumes: [string]

  constructor(config: GeneratorConfig & TypeGuardGeneratorConfig) {
    this.config = config
  }

  initialize(data: T, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = {
      ...createGeneratorContext(data, this.config, generators),
      consumes: this.consumes[0],
      produces: this.produces[0],
    }
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
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

  referenceOf(input: any, target: string): Identifier {
    const { context } = this
    switch (target) {
      case context.produces:
        // TODO does it make sense to generate the assertion AST for non named type?
        // We lose the type guard nature at that point.
        const { nameOf } = context
        return isNil(nameOf(input)) ? undefined : factory.createIdentifier(nameOf(input, target))
      default:
        return undefined
    }
  }

  dependenciesOf(fromPath: string, input: any, target: string): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case context.produces:
        return getModelImports(fromPath, target, [input], this.context)
      default:
        return []
    }
  }
}
