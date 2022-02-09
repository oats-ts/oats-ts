import { TypeGuardGeneratorConfig } from '@oats-ts/json-schema-type-guards-generator'
import { TypesGeneratorConfig } from '@oats-ts/json-schema-types-generator'
import { ValidatorsGeneratorConfig } from '@oats-ts/json-schema-validators-generator'
import { ApiTypeGeneratorConfig } from '@oats-ts/openapi-api-type-generator'
import { ExpressRouteGeneratorConfig } from '@oats-ts/openapi-express-routes-generator'
import { OperationsGeneratorConfig } from '@oats-ts/openapi-operations-generator'
import { ParameterTypesGeneratorConfig } from '@oats-ts/openapi-parameter-types-generator'
import { SdkGeneratorConfig } from '@oats-ts/openapi-sdk-generator'

export type PresetConfiguration = {
  'openapi/api-type'?: boolean | ApiTypeGeneratorConfig
  'openapi/express-route'?: boolean | ExpressRouteGeneratorConfig
  'openapi/operation'?: boolean | OperationsGeneratorConfig
  'openapi/path-type'?: boolean | ParameterTypesGeneratorConfig
  'openapi/query-type'?: boolean | ParameterTypesGeneratorConfig
  'openapi/request-headers-type'?: boolean | ParameterTypesGeneratorConfig
  'openapi/sdk-type'?: boolean | SdkGeneratorConfig
  'openapi/sdk-impl'?: boolean | SdkGeneratorConfig
  'json-schema/type'?: boolean | TypesGeneratorConfig
  'json-schema/type-guard'?: boolean | TypeGuardGeneratorConfig
  'json-schema/type-validator'?: boolean | ValidatorsGeneratorConfig
  'openapi/response-headers-type'?: boolean | ParameterTypesGeneratorConfig
  'openapi/express-cors-middleware'?: boolean
  'openapi/express-route-factory'?: boolean
  'openapi/express-routes-type'?: boolean
  'openapi/path-deserializer'?: boolean
  'openapi/path-serializer'?: boolean
  'openapi/query-deserializer'?: boolean
  'openapi/query-serializer'?: boolean
  'openapi/request-body-validator'?: boolean
  'openapi/request-headers-deserializer'?: boolean
  'openapi/request-headers-serializer'?: boolean
  'openapi/request-server-type'?: boolean
  'openapi/request-type'?: boolean
  'openapi/response-body-validator'?: boolean
  'openapi/response-headers-deserializer'?: boolean
  'openapi/response-headers-serializer'?: boolean
  'openapi/response-type'?: boolean
  'openapi/sdk-stub'?: boolean
}
