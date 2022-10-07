import { EnhancedPathItem, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, Identifier, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { getCorsRouterFactoryAst } from './getCorsRouterFactoryAst'
import { PathBasedCodeGenerator } from '../utils/PathBasedCodeGenerator'
import { isNil } from 'lodash'

export class ExpressCorsRouterFactoryGenerator extends PathBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-cors-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cors-configuration']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Express.name, version: '^4.18.1' }]
  }

  public referenceOf(input: OpenAPIObject): Identifier | undefined {
    const [paths] = this.items
    return paths?.length > 0 ? factory.createIdentifier(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [paths] = this.items
    return paths?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  public async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(createSourceFile(path, this.getImports(path), [getCorsRouterFactoryAst(paths, this.context)]))
  }

  private getImports(path: string): ImportDeclaration[] {
    const paths = this.items[0]

    if (isNil(paths) || paths.length === 0) {
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
      ...getModelImports<OpenAPIGeneratorTarget>(
        path,
        'oats/cors-configuration',
        [this.context.document],
        this.context,
      ),
    ]
  }
}
