import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getCorsMiddlewareAst } from './getCorsMiddlewareAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class ExpressCorsMiddlewareGenerator extends DocumentBasedCodeGenerator<ExpressCorsMiddlewareGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-cors-middleware'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Express.name, version: '^4.18.1' }]
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode | undefined {
    const [operations] = this.items
    return operations?.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [operations] = this.items
    return operations?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Express.name, [
            RuntimePackages.Express.RequestHandler,
            RuntimePackages.Express.Request,
            RuntimePackages.Express.Response,
            RuntimePackages.Express.NextFunction,
          ]),
        ],
        [getCorsMiddlewareAst(operations, this.context, this.configuration())],
      ),
    )
  }
}
