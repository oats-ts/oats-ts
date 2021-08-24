import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator, OpenAPIGeneratorContext } from './typings'
import { createGeneratorContext } from '@oats-ts/model-common'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig>(
  data: OpenAPIReadOutput,
  config: T,
  generators: OpenAPIGenerator[],
): OpenAPIGeneratorContext {
  return createGeneratorContext(data, config, generators)
}
