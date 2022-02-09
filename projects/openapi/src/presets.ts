import { createPreset } from './createPreset'
import { PresetConfiguration } from './typings'

const commonConfig: PresetConfiguration = {
  'json-schema/type': true,
  'json-schema/type-validator': true,
  'json-schema/type-guard': true,
  'openapi/query-type': true,
  'openapi/path-type': true,
  'openapi/request-headers-type': true,
  'openapi/response-headers-type': true,
  'openapi/response-type': true,
}

const serverOnlyConfig: PresetConfiguration = {
  'openapi/request-server-type': true,
  'openapi/request-body-validator': true,
  'openapi/response-headers-serializer': true,
  'openapi/path-deserializer': true,
  'openapi/query-deserializer': true,
  'openapi/request-headers-deserializer': true,
  'openapi/api-type': true,
  'openapi/express-route': true,
  'openapi/express-routes-type': true,
  'openapi/express-route-factory': true,
  'openapi/express-cors-middleware': true,
}

const clientOnlyConfig: PresetConfiguration = {
  'openapi/request-type': true,
  'openapi/response-body-validator': true,
  'openapi/response-headers-deserializer': true,
  'openapi/path-serializer': true,
  'openapi/query-serializer': true,
  'openapi/request-headers-serializer': true,
  'openapi/operation': true,
  'openapi/sdk-type': true,
  'openapi/sdk-impl': true,
  'openapi/sdk-stub': true,
}

const server = createPreset({
  ...commonConfig,
  ...serverOnlyConfig,
})

const client = createPreset({
  ...commonConfig,
  ...clientOnlyConfig,
})

const fullStack = createPreset({
  ...commonConfig,
  ...serverOnlyConfig,
  ...clientOnlyConfig,
})

export const presets = {
  client,
  server,
  fullStack,
}
