import { GeneratorContext, HasSchemas } from '@oats-ts/model-common'

export type TypesGeneratorConfig = {
  /**
   * If set to true, the description and deprecated fields in SchemaObjects will be used to generate
   * documentation for the generated types (or possibly enums). Otherwise docs will be omitted.
   */
  documentation?: boolean
}

export type TypesGeneratorContext = GeneratorContext<HasSchemas> & {
  target: string
}
