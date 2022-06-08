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
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { GeneratorItem } from '../internalTypings'
import { success, Try } from '@oats-ts/try'
import { getRoutesTypeAst } from './getRoutesTypeAst'

export class ExpressRoutesTypeGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  GeneratorItem,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/express-routes-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/express-route']
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

  protected async generateItem({ document, operations }: GeneratorItem): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(document, this.name()),
        [getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router])],
        [getRoutesTypeAst(operations, this.context)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const [{ operations }] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [{ operations }] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
