import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export type RootGeneratorConfig = GeneratorConfig & {
  name?: string
  children: OpenAPIGenerator | OpenAPIGenerator[]
}

export type OpenAPIGenerator = CodeGenerator<OpenAPIReadOutput, SourceFile>
