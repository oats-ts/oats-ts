import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { GeneratorItem } from '../internalTypings'
import { success, Try } from '@oats-ts/try'
import { getCorsMiddlewareAst } from './getCorsMiddlewareAst'

export class ExpressCorsMiddlewareGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  GeneratorItem,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/express-cors-middleware'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Express.name]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): GeneratorItem[] {
    return [
      {
        document: this.input.document,
        operations: sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
          this.context.nameOf(operation, 'openapi/express-route'),
        ),
      },
    ]
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode {
    const [{ operations }] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [{ operations }] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  public async generateItem({ document, operations }: GeneratorItem): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(document, this.name())
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
        [getCorsMiddlewareAst(operations, this.context)],
      ),
    )
  }
}
