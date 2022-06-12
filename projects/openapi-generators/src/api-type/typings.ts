import { GeneratorConfig } from '@oats-ts/generator'

export type ApiTypeGeneratorConfig = Partial<GeneratorConfig> & {
  documentation: boolean
}
