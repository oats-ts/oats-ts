import { createGeneratorContext } from '@oats-ts/model-common'
import { GeneratorContext, GeneratorInit, GroupGenerator } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export class OpenAPIGroupGenerator extends GroupGenerator<OpenAPIReadOutput, SourceFile, GeneratorContext> {
  private _context!: GeneratorContext

  initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this._context = createGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  context(): GeneratorContext<any, string, string> {
    return this._context
  }
}
