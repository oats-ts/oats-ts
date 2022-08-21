import { OperationObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, hasInput, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRequestTypeAst } from '../utils/request/getRequestTypeAst'
import { requestPropertyFactory } from './requestPropertyFactory'
import { getCommonImports } from '../utils/request/getCommonImports'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class RequestTypesGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/request-headers-type', 'oats/query-type', 'oats/path-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  protected shouldGenerate(operation: EnhancedOperation): boolean {
    return hasInput(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'oats/request-type')
    const ast = getRequestTypeAst(
      this.context.nameOf(data.operation, 'oats/request-type'),
      data,
      this.context,
      requestPropertyFactory,
    )
    return success(createSourceFile(path, getCommonImports(path, data, this.context), [ast]))
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasInput(this.enhanced(input), this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasInput(this.enhanced(input), this.context)
      ? getModelImports(fromPath, this.name(), [input], this.context)
      : []
  }
}
