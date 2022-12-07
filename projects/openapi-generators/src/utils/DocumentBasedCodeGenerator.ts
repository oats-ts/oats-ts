import { OpenAPIGeneratorTarget, EnhancedOperation, getEnhancedOperations } from '@oats-ts/openapi-common'
import { OpenAPICodeGeneratorImpl } from './OpenAPICodeGeneratorImpl'
import { isNil, sortBy } from 'lodash'

export abstract class DocumentBasedCodeGenerator<Cfg> extends OpenAPICodeGeneratorImpl<Cfg, EnhancedOperation[]> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected shouldGenerate(operations: EnhancedOperation[]): boolean {
    return operations.length > 0
  }

  protected getItems(): [] | [EnhancedOperation[]] {
    const operations = sortBy(
      getEnhancedOperations(this.input.document, this.context()),
      ({ operation, method, url }) => (isNil(operation.operationId) ? `${method}-${url}` : operation.operationId),
    )
    return this.shouldGenerate(operations) ? [operations] : []
  }
}
