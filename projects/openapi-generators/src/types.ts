import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export type RootGeneratorConfig = GeneratorConfig & {
  name?: string
}

export type OpenAPIGenerator = CodeGenerator<OpenAPIReadOutput, SourceFile>
