import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { LocalNameDefaults, OpenAPIGeneratorContext, OpenAPIReadOutput } from './typings'
import { isSuccess, Try } from '@oats-ts/try'
import { SourceFile } from 'typescript'
import { OpenAPIGeneratorContextImpl } from './OpenAPIGeneratorContextImpl'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig, L extends LocalNameDefaults>(
  owner: CodeGenerator<OpenAPIReadOutput, SourceFile>,
  data: OpenAPIReadOutput,
  config: T,
  generators: Try<CodeGenerator<OpenAPIReadOutput, SourceFile>[]>,
  locals?: L,
): OpenAPIGeneratorContext {
  return new OpenAPIGeneratorContextImpl(
    owner,
    data,
    config,
    isSuccess(generators) ? generators.data : [],
    locals ?? {},
  )
}
