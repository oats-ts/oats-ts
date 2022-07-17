import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { isSuccess, Try } from '@oats-ts/try'
import { GeneratorContextImpl } from './GeneratorContextImpl'
import { GeneratorContext, ReadOutput } from './types'

export function createGeneratorContext<R, T extends string, C extends GeneratorConfig>(
  owner: CodeGenerator<any, any>,
  data: ReadOutput<R>,
  config: C,
  generators: Try<CodeGenerator<any, any>[]>,
): GeneratorContext<R, T> {
  return new GeneratorContextImpl(owner, data, config, isSuccess(generators) ? generators.data : [])
}
