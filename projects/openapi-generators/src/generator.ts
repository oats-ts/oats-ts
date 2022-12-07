import { ContentGenerator } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import { RootGeneratorConfig } from './types'
import { OpenAPIGenerator } from './OpenAPIGenerator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'

export function generator(config: RootGeneratorConfig): ContentGenerator<OpenAPIReadOutput, SourceFile> {
  return new OpenAPIGenerator(config)
}
