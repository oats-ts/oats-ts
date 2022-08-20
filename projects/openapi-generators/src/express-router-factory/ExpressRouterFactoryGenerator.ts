import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRouterFactoryAst } from './getRouterFactoryAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { ExpressRouterFactoryGeneratorConfig } from './typings'

export class ExpressRouterFactoryGenerator extends DocumentBasedCodeGenerator<ExpressRouterFactoryGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-router-factory'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/express-router', 'oats/express-routers-type', 'oats/api-type']
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
          ...getModelImports<OpenAPIGeneratorTarget>(path, 'oats/api-type', [this.input.document], this.context),
          ...getModelImports<OpenAPIGeneratorTarget>(
            path,
            'oats/express-routers-type',
            [this.input.document],
            this.context,
          ),
          ...getModelImports<OpenAPIGeneratorTarget>(
            path,
            'oats/express-router',
            operations.map(({ operation }) => operation),
            this.context,
          ),
        ],
        [getRouterFactoryAst(operations, this.context, this.config)],
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
