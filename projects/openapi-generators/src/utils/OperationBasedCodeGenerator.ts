import { isNil, sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIGenerator } from './OpenAPIGenerator'

export abstract class OperationBasedCodeGenerator<Cfg> extends OpenAPIGenerator<Cfg, EnhancedOperation> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context()), ({ operation }) =>
      this.context().nameOf(operation, this.name()),
    )
  }

  protected enhanced(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }
}
