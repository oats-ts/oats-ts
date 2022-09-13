import { OperationObject } from '@oats-ts/openapi-model'
import { isEmpty, sortBy } from 'lodash'
import { EnhancedOperation, getEnhancedOperations } from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { ParameterTypesGenerator } from './ParameterTypesGenerator'

export abstract class InputParameterTypesGenerator extends ParameterTypesGenerator<EnhancedOperation> {
  protected getEnhancedOperation(data: EnhancedOperation): EnhancedOperation {
    return data
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, this.name()),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | undefined {
    const params = this.getParameterObjects(this.enhanced(input))
    return isEmpty(params) ? undefined : factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.getParameterObjects(this.enhanced(input))
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
