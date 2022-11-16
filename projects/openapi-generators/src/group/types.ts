import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPICodeGenerator } from '../types'

export type GroupGeneratorConfig = Partial<GeneratorConfig> & {
  name: string
  children: OpenAPICodeGenerator | OpenAPICodeGenerator[]
}
