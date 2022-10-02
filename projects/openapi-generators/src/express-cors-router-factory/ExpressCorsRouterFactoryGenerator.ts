import {
  createOpenAPIGeneratorContext,
  EnhancedPathItem,
  getEnhancedPathItems,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { ExpressCorsRouterFactoryGeneratorConfig } from './typings'
import { BaseCodeGenerator, RuntimeDependency } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { getCorsMiddlewareAst } from './getCorsMiddlewareAst'
import { getCorsEnabledPaths } from './getCorsEnabledPaths'

export class ExpressCorsRouterFactoryGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ExpressCorsRouterFactoryGeneratorConfig,
  EnhancedPathItem[],
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-cors-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedPathItem[][] {
    const paths = getEnhancedPathItems(this.input.document, this.context).filter(
      ({ operations }) => operations.length > 0,
    )
    return [paths].filter((p) => p.length > 0)
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Express.name, version: '^4.18.1' }]
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode | undefined {
    const [paths] = this.items
    return paths?.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [paths] = this.items
    return paths?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  public async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(path, this.getImports(), [getCorsMiddlewareAst(paths, this.context, this.configuration())]),
    )
  }

  private getImports(): ImportDeclaration[] {
    const paths = this.items[0]
    if (getCorsEnabledPaths(paths, this.configuration()).length === 0) {
      return [
        getNamedImports(RuntimePackages.Express.name, [
          RuntimePackages.Express.IRouter,
          RuntimePackages.Express.Router,
        ]),
      ]
    }
    return [
      getNamedImports(RuntimePackages.Express.name, [
        RuntimePackages.Express.IRouter,
        RuntimePackages.Express.Router,
        RuntimePackages.Express.Request,
        RuntimePackages.Express.Response,
        RuntimePackages.Express.NextFunction,
      ]),
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ServerAdapter]),
      getNamedImports(RuntimePackages.HttpServerExpress.name, [RuntimePackages.HttpServerExpress.ExpressToolkit]),
    ]
  }
}
