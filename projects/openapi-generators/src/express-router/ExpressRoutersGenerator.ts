import { OpenAPIGeneratorTarget, RuntimePackages, EnhancedOperation } from '@oats-ts/openapi-common'
import { ExpressRoutersGeneratorConfig } from './typings'
import { OperationObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getExpressRouterImports } from './getExpressRouterImports'
import { getExpressRouterAst } from './getExpressRouterAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class ExpressRoutersGenerator extends OperationBasedCodeGenerator<ExpressRoutersGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-router'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return [
      'oats/type',
      'oats/request-server-type',
      'oats/response-type',
      'oats/api-type',
      'oats/path-deserializer',
      'oats/query-deserializer',
      'oats/request-headers-deserializer',
      'oats/response-headers-serializer',
      'oats/request-body-validator',
    ]
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Http.name, RuntimePackages.HttpServerExpress.name, RuntimePackages.Express.name]
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(this.context.pathOf(item.operation, this.name()), getExpressRouterImports(item, this.context), [
        getExpressRouterAst(item, this.context, this.config),
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
