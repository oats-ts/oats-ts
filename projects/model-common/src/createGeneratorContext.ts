import { CodeGenerator, GeneratorConfig, GeneratorContext } from '@oats-ts/oats-ts'
import { isSuccess, Try } from '@oats-ts/try'
import { GeneratorContextImpl } from './GeneratorContextImpl'
import { LocalNameDefaults, ReadOutput } from './types'

export function createGeneratorContext<R, T extends string, C extends GeneratorConfig>(
  owner: CodeGenerator<any, any>,
  data: ReadOutput<R>,
  config: C,
  generators: Try<CodeGenerator<any, any>[]>,
): GeneratorContext<R, T>

export function createGeneratorContext<R, T extends string, C extends GeneratorConfig, L extends LocalNameDefaults>(
  owner: CodeGenerator<any, any>,
  data: ReadOutput<R>,
  config: C,
  generators: Try<CodeGenerator<any, any>[]>,
  locals?: L,
): GeneratorContext<R, T> {
  return new GeneratorContextImpl(owner, data, config, isSuccess(generators) ? generators.data : [], locals ?? {})
}
