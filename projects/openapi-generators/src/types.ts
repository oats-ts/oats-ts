import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export type Config<T = {}> = boolean | (Partial<GeneratorConfig> & Partial<T>)

export type RootGeneratorConfig = GeneratorConfig & {
  name?: string
  children: OpenAPICodeGenerator | OpenAPICodeGenerator[]
}

export type OpenAPICodeGenerator = CodeGenerator<OpenAPIReadOutput, SourceFile>
