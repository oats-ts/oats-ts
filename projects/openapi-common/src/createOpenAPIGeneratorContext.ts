import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGeneratorContext } from './typings'
import { createJsonSchemaBasedGeneratorContext, LocalNameDefaults } from '@oats-ts/model-common'
import { Try } from '@oats-ts/try'
import { SourceFile } from 'typescript'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig, L extends LocalNameDefaults>(
  owner: CodeGenerator<OpenAPIReadOutput, SourceFile>,
  data: OpenAPIReadOutput,
  config: T,
  generators: Try<CodeGenerator<OpenAPIReadOutput, SourceFile>[]>,
  locals?: LocalNameDefaults,
): OpenAPIGeneratorContext {
  return createJsonSchemaBasedGeneratorContext(owner, data, config, generators, locals ?? {})
}
