import { sortBy } from 'lodash'
import { getEnhancedOperations, OpenAPIGeneratorTarget, EnhancedOperation } from '@oats-ts/openapi-common'
import { OpenAPIGenerator } from './OpenAPIGenerator'

export abstract class DocumentBasedCodeGenerator<Cfg> extends OpenAPIGenerator<Cfg, EnhancedOperation[]> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected shouldGenerate(operations: EnhancedOperation[]): boolean {
    return operations.length > 0
  }

  protected getItems(): [] | [EnhancedOperation[]] {
    const operations = sortBy(getEnhancedOperations(this.input.document, this.context()), ({ operation }) =>
      this.context().nameOf(operation),
    )
    return this.shouldGenerate(operations) ? [operations] : []
  }
}
