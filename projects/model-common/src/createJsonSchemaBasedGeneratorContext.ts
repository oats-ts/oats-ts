import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { isSuccess, Try } from '@oats-ts/try'
import { JsonSchemaBasedGeneratorContextImpl } from './JsonSchemaBasedGeneratorContextImpl'
import { JsonSchemaBasedGeneratorContext, LocalNameDefaults, ReadOutput } from './types'

export function createJsonSchemaBasedGeneratorContext<R, T extends string, C extends GeneratorConfig>(
  owner: CodeGenerator<any, any>,
  data: ReadOutput<R>,
  config: C,
  generators: Try<CodeGenerator<any, any>[]>,
  locals?: LocalNameDefaults,
): JsonSchemaBasedGeneratorContext<R, T> {
  return new JsonSchemaBasedGeneratorContextImpl(
    owner,
    data,
    config,
    isSuccess(generators) ? generators.data : [],
    locals ?? {},
  )
}
