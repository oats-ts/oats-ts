import { ParameterLocation, ParameterStyle } from '@oats-ts/openapi-model'

export type SchemaType = 'primitive' | 'array' | 'object'

export type ParameterGeneratorConfig = {
  location: ParameterLocation
  style: ParameterStyle
  requiredValues: boolean[]
  explodeValues: boolean[]
  schemaTypes: SchemaType[]
}
