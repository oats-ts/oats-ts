import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export type RootGeneratorConfig = GeneratorConfig & {
  name?: string
}

export type GroupGeneratorConfig = Partial<GeneratorConfig> & {
  name: string
}

export type OAGen = CodeGenerator<OpenAPIReadOutput, SourceFile>
