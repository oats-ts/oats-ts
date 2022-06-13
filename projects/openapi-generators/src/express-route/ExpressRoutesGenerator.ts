import { OpenAPIGeneratorTarget, RuntimePackages, EnhancedOperation } from '@oats-ts/openapi-common'
import { ExpressRoutesGeneratorConfig } from './typings'
import { OperationObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getExpressRouterImports } from './getExpressRouterImports'
import { getExpressRouteAst } from './getExpressRouteAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class ExpressRoutesGenerator extends OperationBasedCodeGenerator<ExpressRoutesGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/express-route'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return [
      'openapi/request-server-type',
      'openapi/response-type',
      'openapi/api-type',
      'openapi/path-deserializer',
      'openapi/query-deserializer',
      'openapi/request-headers-deserializer',
    ]
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Http.name, RuntimePackages.HttpServerExpress.name, RuntimePackages.Express.name]
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(this.context.pathOf(item.operation, this.name()), getExpressRouterImports(item, this.context), [
        getExpressRouteAst(item, this.context, this.config),
      ]),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.id, [input], this.context)
  }
}
