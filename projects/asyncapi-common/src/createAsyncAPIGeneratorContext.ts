import { GeneratorConfig } from '@oats-ts/generator'
import { AsyncAPIGenerator, AsyncAPIGeneratorContext } from './typings'
import { createGeneratorContext } from '@oats-ts/model-common'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'

export function createAsyncAPIGeneratorContext<T extends GeneratorConfig>(
  data: AsyncAPIReadOutput,
  config: T,
  generators: AsyncAPIGenerator[],
): AsyncAPIGeneratorContext {
  return createGeneratorContext(data, config, generators)
}
