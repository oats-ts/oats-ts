export type OperationsGeneratorConfig = {
  /**
   * If set to true, the summary, description and deprecated fields in OperationObjects will be used
   * to generate documentation for the generated methods. Otherwise docs will be omitted.
   */
  documentation?: boolean
  /**
   * If set to true, validators will be generated for the response parser hint objects. This will allow
   * responses to be validated. This is useful, in case you are unsure the backend respects the contract.
   */
  validate?: boolean
}
