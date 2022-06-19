import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { SourceFile } from 'typescript'

export abstract class DocumentBasedCodeGenerator<Cfg> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  Cfg,
  EnhancedOperation[],
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected shouldGenerate(operations: EnhancedOperation[]): boolean {
    return operations.length > 0
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): [] | [EnhancedOperation[]] {
    const operations = sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation),
    )
    return this.shouldGenerate(operations) ? [operations] : []
  }
}
