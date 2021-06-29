export type ApiGeneratorConfig = {
  /**
   * When true, a type (interface) will be generated with all the operations.
   * This is reuseable, where you only need type signatures, but no implementation detail.
   */
  type: boolean
  /**
   * When true, a class will be generated with all the operations. The class takes
   * A configuration as constructor argument, and has all the operation methods with
   * a simplified signature (config can be ommited). If type set to true, it also
   * declares that it implements above type.
   */
  class: boolean
  /**
   * When true, a class will be generated with all the operations. The methods call
   * A fallback method that does nothing just throws an exception. This is ideal for testing,
   * Where you might want to implement the relevant methods from the class returning mock data.
   * If type set to true, it also declares that it implements above type.
   */
  stub: boolean
  /**
   * If set to true, the summary, description and deprecated fields in OperationObjects will be used
   * to generate documentation for the generated methods in type. Otherwise docs will be omitted.
   */
  documentation: boolean
}
