import { ContentGenerator } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'
import { RootGeneratorConfig } from './types'
import { OpenAPIGenerator } from './OpenAPIGenerator'

export function generator(config: RootGeneratorConfig): ContentGenerator<OpenAPIReadOutput, SourceFile> {
  return new OpenAPIGenerator(config)
}
