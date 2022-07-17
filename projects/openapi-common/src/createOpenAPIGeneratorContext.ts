import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGeneratorContext } from './typings'
import { createGeneratorContext } from '@oats-ts/model-common'
import { Try } from '@oats-ts/try'
import { SourceFile } from 'typescript'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig>(
  owner: CodeGenerator<OpenAPIReadOutput, SourceFile>,
  data: OpenAPIReadOutput,
  config: T,
  generators: Try<CodeGenerator<OpenAPIReadOutput, SourceFile>[]>,
): OpenAPIGeneratorContext {
  return createGeneratorContext(owner, data, config, generators)
}
