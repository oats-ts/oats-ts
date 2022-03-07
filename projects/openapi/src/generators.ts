import {
  queryParameterTypes,
  pathParameterTypes,
  requestHeaderParameterTypes,
  responseHeaderParameterTypes,
} from '@oats-ts/openapi-parameter-types-generator'
import { responseBodyValidators, requestBodyValidators } from '@oats-ts/openapi-validators-generator'
import { apiType } from '@oats-ts/openapi-api-type-generator'
import { sdkStub, sdkType, sdkImplementation } from '@oats-ts/openapi-sdk-generator'
import { operations } from '@oats-ts/openapi-operations-generator'
import { requestTypes, requestServerTypes } from '@oats-ts/openapi-request-types-generator'
import { responseTypes } from '@oats-ts/openapi-response-types-generator'
import {
  pathParameterSerializers,
  queryParameterSerializers,
  requestHeaderParameterSerializers,
  responseHeaderParameterSerializers,
} from '@oats-ts/openapi-parameter-serializers-generator'
import {
  pathParameterDeserializers,
  queryParameterDeserializers,
  requestHeaderParameterDeserializers,
  responseHeaderParameterDeserializers,
} from '@oats-ts/openapi-parameter-deserializers-generator'
import {
  expressRoute,
  expressRoutesType,
  expressRouteFactory,
  expressCorsMiddleware,
} from '@oats-ts/openapi-express-routes-generator'
import { types, TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'
import { TypeGuardGeneratorConfig, typeGuards } from '@oats-ts/json-schema-type-guards-generator'
import { typeValidators, ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'

export const generators = {
  types: types as (config?: Partial<TypesGeneratorConfig>) => OpenAPIGenerator,
  typeGuards: typeGuards as (config?: Partial<TypeGuardGeneratorConfig>) => OpenAPIGenerator,
  typeValidators: typeValidators as (config?: Partial<ValidatorsGeneratorConfig>) => OpenAPIGenerator,
  responseBodyValidators,
  requestBodyValidators,
  queryParameterTypes,
  pathParameterTypes,
  requestHeaderParameterTypes,
  responseHeaderParameterTypes,
  apiType,
  sdkStub,
  sdkType,
  sdkImplementation,
  operations,
  requestTypes,
  requestServerTypes,
  responseTypes,
  pathParameterSerializers,
  queryParameterSerializers,
  requestHeaderParameterSerializers,
  responseHeaderParameterSerializers,
  pathParameterDeserializers,
  queryParameterDeserializers,
  requestHeaderParameterDeserializers,
  responseHeaderParameterDeserializers,
  expressRoute,
  expressRoutesType,
  expressRouteFactory,
  expressCorsMiddleware,
} as const
