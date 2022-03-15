import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { generateRoutesType } from './generateRoutesType'
import { ExpressRouteGeneratorConfig } from '..'

export class ExpressRouteFactoryGenerator implements OpenAPIGenerator<'openapi/express-route-factory'> {
  private context: OpenAPIGeneratorContext = null
  private operations: EnhancedOperation[] = []
  private routeFactoryConfig: ExpressRouteGeneratorConfig

  public readonly id = 'openapi/express-route-factory'
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/express-route']
  public readonly runtimeDepencencies: string[] = [
    RuntimePackages.Http.name,
    RuntimePackages.HttpServerExpress.name,
    RuntimePackages.Express.name,
  ]

  public constructor(config: ExpressRouteGeneratorConfig) {
    this.routeFactoryConfig = config
  }

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, routeFactoryConfig } = this
    const { document, nameOf } = context
    this.operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/express-route'),
    )
    const data: TypeScriptModule[] =
      this.operations.length > 0
        ? mergeTypeScriptModules([generateRoutesType(this.operations, context, routeFactoryConfig)])
        : []

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return this.operations.length > 0 ? factory.createTypeReferenceNode(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return this.operations.length > 0 ? getModelImports(fromPath, this.id, [input], context) : []
  }
}
