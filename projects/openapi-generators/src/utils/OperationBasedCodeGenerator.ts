import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isNil, sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { SourceFile } from 'typescript'
import { OperationObject } from '@oats-ts/openapi-model'

export abstract class OperationBasedCodeGenerator<Cfg> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  Cfg,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, this.name()),
    )
  }

  protected enhanced(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      console.log(this.items, operation)
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }
}
