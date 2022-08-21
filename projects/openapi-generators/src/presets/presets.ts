import { createPreset } from './createPreset'
import { PresetGeneratorConfiguration } from './types'

export const commonConfig: PresetGeneratorConfiguration = {
  'oats/type': true,
  'oats/type-validator': true,
  'oats/type-guard': true,
  'oats/query-type': true,
  'oats/path-type': true,
  'oats/request-headers-type': true,
  'oats/response-headers-type': true,
  'oats/response-type': true,
}

export const serverOnlyConfig: PresetGeneratorConfiguration = {
  'oats/request-server-type': true,
  'oats/request-body-validator': true,
  'oats/response-headers-serializer': true,
  'oats/path-deserializer': true,
  'oats/query-deserializer': true,
  'oats/request-headers-deserializer': true,
  'oats/api-type': true,
  'oats/express-router': true,
  'oats/express-routers-type': true,
  'oats/express-router-factory': true,
  'oats/express-cors-middleware': true,
}

export const clientOnlyConfig: PresetGeneratorConfiguration = {
  'oats/request-type': true,
  'oats/response-body-validator': true,
  'oats/response-headers-deserializer': true,
  'oats/path-serializer': true,
  'oats/query-serializer': true,
  'oats/request-headers-serializer': true,
  'oats/operation': true,
  'oats/sdk-type': true,
  'oats/sdk-impl': true,
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
