import { GeneratorContext } from '@oats-ts/model-common'

/** With this configuration you generate type guards that can deeply check your inputs */
export type FullTypeGuardGeneratorConfig = {
  /** When true nested $refs will be checked asserted, when false these checks will be ommited. */
  references: boolean
  /** When true, contents of records (additionalProperties) will be checked, otherwise only their type will be asserted. */
  records: boolean
  /** When true, contents of arrays (items) will be checked, otherwise only their type will be asserted. */
  arrays: boolean
}

/** When this configuration is used, type guards will be only generated for union types, based on discriminators. */
export type UnionTypeGuardGeneratorConfig = {
  /** When set, type guards will be only generated for union types based, on discriminators. */
  discriminatorBased: true
}

export type TypeGuardGeneratorConfig = UnionTypeGuardGeneratorConfig | FullTypeGuardGeneratorConfig

export type TypeGuardGeneratorContext = GeneratorContext & {
  produces: string
  consumes: string
}