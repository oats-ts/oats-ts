import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGenerator } from '../types'

export type GroupGeneratorConfig = Partial<GeneratorConfig> & {
  name: string
  children: OpenAPIGenerator | OpenAPIGenerator[]
}
