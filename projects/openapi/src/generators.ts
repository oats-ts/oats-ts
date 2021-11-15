import {
  queryParameterTypes,
  pathParameterTypes,
  requestHeaderParameterTypes,
  responseHeaderParameterTypes,
} from '@oats-ts/openapi-parameter-types-generator'
import { typeValidators, responseBodyValidators, requestBodyValidators } from '@oats-ts/openapi-validators-generator'
import { types } from '@oats-ts/openapi-types-generator'
import { apiType } from '@oats-ts/openapi-api-type-generator'
import { sdkStub, sdkType, sdkImplementation } from '@oats-ts/openapi-sdk-generator'
import { typeGuards } from '@oats-ts/openapi-type-guards-generator'
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
import { expressRoute, expressRoutesType, expressRouteFactory } from '@oats-ts/openapi-express-routes-generator'

export const generators = {
  types,
  typeValidators,
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
  typeGuards,
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
}
