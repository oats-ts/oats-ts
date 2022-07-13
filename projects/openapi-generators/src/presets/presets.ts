import { createPreset } from './createPreset'
import { PresetGeneratorConfiguration } from './types'

export const commonConfig: PresetGeneratorConfiguration = {
  'json-schema/type': true,
  'json-schema/type-validator': true,
  'json-schema/type-guard': true,
  'openapi/query-type': true,
  'openapi/path-type': true,
  'openapi/request-headers-type': true,
  'openapi/response-headers-type': true,
  'openapi/response-type': true,
}

export const serverOnlyConfig: PresetGeneratorConfiguration = {
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

export const clientOnlyConfig: PresetGeneratorConfiguration = {
  'openapi/request-type': true,
  'openapi/response-body-validator': true,
  'openapi/response-headers-deserializer': true,
  'openapi/path-serializer': true,
  'openapi/query-serializer': true,
  'openapi/request-headers-serializer': true,
  'openapi/operation': true,
  'openapi/sdk-type': true,
  'openapi/sdk-impl': true,
}

const server = createPreset('server', {
  ...commonConfig,
  ...serverOnlyConfig,
})

const client = createPreset('client', {
  ...commonConfig,
  ...clientOnlyConfig,
})

const fullStack = createPreset('full-stack', {
  ...commonConfig,
  ...serverOnlyConfig,
  ...clientOnlyConfig,
})

export const presets = {
  client,
  server,
  fullStack,
}
