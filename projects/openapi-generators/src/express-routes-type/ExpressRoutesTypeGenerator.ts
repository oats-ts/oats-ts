import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRoutesTypeAst } from './getRoutesTypeAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'

export class ExpressRoutesTypeGenerator extends DocumentBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/express-routes-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/express-route']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Express.name]
  }

  protected async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(this.input.document, this.name()),
        [getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router])],
        [getRoutesTypeAst(operations, this.context)],
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
