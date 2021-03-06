import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getMainRouteFactoryAst } from './getRouteFactoryAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { ExpressRoutesGeneratorConfig } from '../express-route/typings'

export class ExpressRouteFactoryGenerator extends DocumentBasedCodeGenerator<ExpressRoutesGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/express-route-factory'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/express-route', 'openapi/express-routes-type', 'openapi/api-type']
  }
  public runtimeDependencies(): string[] {
    return [RuntimePackages.Http.name, RuntimePackages.HttpServerExpress.name, RuntimePackages.Express.name]
  }

  protected async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router]),
          getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ServerAdapter]),
          getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressToolkit]),
          ...getModelImports<OpenAPIGeneratorTarget>(path, 'openapi/api-type', [this.input.document], this.context),
          ...getModelImports<OpenAPIGeneratorTarget>(
            path,
            'openapi/express-routes-type',
            [this.input.document],
            this.context,
          ),
          ...getModelImports<OpenAPIGeneratorTarget>(
            path,
            'openapi/express-route',
            operations.map(({ operation }) => operation),
            this.context,
          ),
        ],
        [getMainRouteFactoryAst(operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations?.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
