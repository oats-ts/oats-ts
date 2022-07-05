import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator } from '../types'

export type GroupGeneratorConfig = Partial<GeneratorConfig> & {
  name: string
  children: OpenAPIGenerator | OpenAPIGenerator[]
}
