import { ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'

export type SchemaType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'string-array'
  | 'number-array'
  | 'boolean-array'
  | 'enum-array'
  | 'object'

export type ParameterGeneratorConfig = {
  location: ParameterLocation | 'response-header'
  style: ParameterStyle
  requiredValues: boolean[]
  explodeValues: boolean[]
  schemaTypes: SchemaType[]
}
