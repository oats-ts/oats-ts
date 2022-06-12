import { OperationObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'
import { EnhancedOperation, hasInput, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRequestTypeAst } from '../utils/request/getRequestTypeAst'
import { requestPropertyFactory } from './requestPropertyFactory'
import { getCommonImports } from '../utils/request/getCommonImports'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class RequestTypesGenerator extends OperationBasedCodeGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/request-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'openapi/request-headers-type', 'openapi/query-type', 'openapi/path-type']
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected itemFilter(operation: EnhancedOperation): boolean {
    return hasInput(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'openapi/request-type')
    const ast = getRequestTypeAst(
      this.context.nameOf(data.operation, 'openapi/request-type'),
      data,
      this.context,
      requestPropertyFactory,
    )
    return success(createSourceFile(path, getCommonImports(path, data, this.context), [ast]))
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return hasInput(this.enhance(input), this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasInput(this.enhance(input), this.context)
      ? getModelImports(fromPath, this.id, [input], this.context)
      : undefined
  }
}
