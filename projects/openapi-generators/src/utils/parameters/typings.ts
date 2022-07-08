import { OperationObject } from '@oats-ts/openapi-model'

export type ParameterTypesGeneratorConfig = {
  /**
   * If set to true, the description and deprecated fields in ParameterObjects will be used
   * to generate documentation for the generated parameter types. Otherwise docs will be omitted.
   */
  documentation: boolean
}

export type ResponseParameterInput = [OperationObject, string]
