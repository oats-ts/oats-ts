import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { GeneratorContextImpl } from './GeneratorContextImpl'
import { GeneratorContext, ReadOutput } from './types'

export function createGeneratorContext<R, T extends string, C extends GeneratorConfig>(
  owner: CodeGenerator<any, any>,
  data: ReadOutput<R>,
  config: C,
  generators: CodeGenerator<any, any>[],
): GeneratorContext<R, T> {
  return new GeneratorContextImpl(owner, data, config, generators)
}
