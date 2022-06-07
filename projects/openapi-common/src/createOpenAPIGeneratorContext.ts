import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGeneratorContext } from './typings'
import { createGeneratorContext } from '@oats-ts/model-common'
import { SourceFile } from 'typescript'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig>(
  data: OpenAPIReadOutput,
  config: T,
  generators: CodeGenerator<OpenAPIReadOutput, SourceFile>[],
): OpenAPIGeneratorContext {
  return createGeneratorContext(data, config, generators)
}
