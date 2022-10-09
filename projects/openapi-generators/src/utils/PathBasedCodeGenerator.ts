import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import {
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedPathItem,
  getEnhancedPathItems,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'

export abstract class PathBasedCodeGenerator<Cfg> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  Cfg,
  EnhancedPathItem[],
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedPathItem[][] {
    const paths = getEnhancedPathItems(this.input.document, this.context).filter(
      ({ operations }) => operations.length > 0,
    )
    return [paths].filter((p) => p.length > 0)
  }
}
