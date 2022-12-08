import { GeneratorContext, GeneratorInit, GroupGenerator } from '@oats-ts/oats-ts'
import { createOpenAPIGeneratorContext, OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { SourceFile } from 'typescript'

export class OpenAPIGroupGenerator extends GroupGenerator<OpenAPIReadOutput, SourceFile, GeneratorContext> {
  private _context!: GeneratorContext

  initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this._context = createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  context(): GeneratorContext {
    return this._context
  }
}
