import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { generateExpressRoute } from './generateExpressRoute'
import { ExpressRouteGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OperationObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ExpressRoutesGenerator implements OpenAPIGenerator<'openapi/express-route'> {
  private context: OpenAPIGeneratorContext = null
  private routeConfig: ExpressRouteGeneratorConfig

  public readonly id = 'openapi/express-route'
  public readonly consumes: OpenAPIGeneratorTarget[] = [
    'openapi/request-server-type',
    'openapi/response-type',
    'openapi/api-type',
    'openapi/path-deserializer',
    'openapi/query-deserializer',
    'openapi/request-headers-deserializer',
  ]
  public readonly runtimeDepencencies: string[] = [
    RuntimePackages.Http.name,
    RuntimePackages.HttpServerExpress.name,
    RuntimePackages.Express.name,
  ]

  public constructor(config: ExpressRouteGeneratorConfig) {
    this.routeConfig = config
  }

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, routeConfig } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules(
      operations.map((operation) => generateExpressRoute(operation, context, routeConfig)),
    )

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return factory.createIdentifier(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
