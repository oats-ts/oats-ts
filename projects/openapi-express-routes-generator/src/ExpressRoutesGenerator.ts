import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { generateExpressRoute } from './generateExpressRoute'
import { ExpressRouteGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ExpressRoutesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/express-routes'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
    'openapi/api-type',
    'openapi/path-deserializer',
    'openapi/query-deserializer',
    'openapi/request-headers-deserializer',
  ]
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/express-route']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ExpressRouteGeneratorConfig

  public readonly id: string = ExpressRoutesGenerator.id
  public readonly produces: string[] = ExpressRoutesGenerator.produces
  public readonly consumes: string[] = ExpressRoutesGenerator.consumes

  public constructor(config: GeneratorConfig & ExpressRouteGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules(
      operations.map((operation) => generateExpressRoute(document, operation, context, config)),
    )

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    switch (target) {
      case 'openapi/api-type': {
        return factory.createTypeReferenceNode(nameOf(input, target))
      }
    }
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/api-type': {
        return getModelImports(fromPath, target, [input], context)
      }
      default:
        return []
    }
  }
}
