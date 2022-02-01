import { types as jsonSchemaTypes, TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'
import {
  typeValidators as jsonSchemaTypeValidators,
  ValidatorsGeneratorConfig,
} from '@oats-ts/json-schema-validators-generator'
import {
  TypeGuardGeneratorConfig,
  typeGuards as jsonSchemaTypeGuards,
} from '@oats-ts/json-schema-type-guards-generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'

export const openApiTypes: (config: TypesGeneratorConfig) => OpenAPIGenerator = jsonSchemaTypes('openapi/type')
export const openApiTypeValidators: (config: ValidatorsGeneratorConfig) => OpenAPIGenerator = jsonSchemaTypeValidators(
  'openapi/type-validator',
  'openapi/type',
)
export const openApiTypeGuards: (config: TypeGuardGeneratorConfig) => OpenAPIGenerator = jsonSchemaTypeGuards(
  'openapi/type-guard',
  'openapi/type',
)
