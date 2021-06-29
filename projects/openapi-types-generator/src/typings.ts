export type TypesGeneratorConfig = {
  /**
   * If set to true, the description and deprecated fields in SchemaObjects will be used to generate
   * documentation for the generated types (or possibly enums). Otherwise docs will be omitted.
   */
  documentation: boolean
  /**
   * If set to true, named "enum" type SchemaObjects will be turned into typescript enums (present when transpiled),
   * otherwise they will be turned into string union types (no trace when transpiled).
   */
  enums: boolean
}
