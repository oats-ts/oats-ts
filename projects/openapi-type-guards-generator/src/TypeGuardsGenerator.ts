import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { Result } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig } from './typings'
import { ImportDeclaration, Identifier, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class TypeGuardsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/typeGuards'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/type-guard']

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig

  public readonly id: string = TypeGuardsGenerator.id
  public readonly produces: string[] = TypeGuardsGenerator.produces
  public readonly consumes: string[] = TypeGuardsGenerator.consumes

  constructor(config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig) {
    this.config = config
  }

  initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, 'openapi/type'))
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

  referenceOf(input: any, target: OpenAPIGeneratorTarget): Identifier {
    switch (target) {
      case 'openapi/type-guard':
        const { nameOf } = this.context
        return factory.createIdentifier(nameOf(input, target))
      default:
        return undefined
    }
  }

  dependenciesOf(fromPath: string, input: any, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    switch (target) {
      case 'openapi/type-guard':
        return getModelImports(fromPath, target, [input], this.context)
      default:
        return []
    }
  }
}
