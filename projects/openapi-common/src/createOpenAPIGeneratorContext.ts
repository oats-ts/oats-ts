import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGeneratorContext } from './typings'
import { createGeneratorContext } from '@oats-ts/model-common'
import { SourceFile } from 'typescript'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig>(
  owner: CodeGenerator<OpenAPIReadOutput, SourceFile>,
  data: OpenAPIReadOutput,
  config: T,
  generators: CodeGenerator<OpenAPIReadOutput, SourceFile>[],
): OpenAPIGeneratorContext {
  return createGeneratorContext(owner, data, config, generators)
}
