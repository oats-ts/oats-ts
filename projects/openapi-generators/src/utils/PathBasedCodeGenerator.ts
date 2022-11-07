import {
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedPathItem,
  getEnhancedPathItems,
} from '@oats-ts/openapi-common'
import { OpenAPIGenerator } from './OpenAPIGenerator'

export abstract class PathBasedCodeGenerator<Cfg> extends OpenAPIGenerator<Cfg, EnhancedPathItem[]> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedPathItem[][] {
    const paths = getEnhancedPathItems(this.input.document, this.context()).filter(
      ({ operations }) => operations.length > 0,
    )
    return [paths].filter((p) => p.length > 0)
  }
}
