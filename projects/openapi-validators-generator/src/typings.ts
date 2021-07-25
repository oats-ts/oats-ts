export type ValidatorsGeneratorConfig = {
  /** When true nested $refs will be validated, when false these checks will be ommited. */
  references: boolean
  /** When true, contents of records (additionalProperties) will be checked, otherwise only their type will be asserted. */
  records: boolean
  /** When true, contents of arrays (items) will be checked, otherwise only their type will be asserted. */
  arrays: boolean
}
