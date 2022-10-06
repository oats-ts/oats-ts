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
  'oats/cookies-type': true,
}

export const serverOnlyConfig: PresetGeneratorConfiguration = {
  'oats/request-server-type': true,
  'oats/response-server-type': true,
  'oats/request-body-validator': true,
  'oats/cookie-deserializer': true,
  'oats/set-cookie-serializer': true,
  'oats/response-headers-serializer': true,
  'oats/path-deserializer': true,
  'oats/query-deserializer': true,
  'oats/request-headers-deserializer': true,
  'oats/api-type': true,
  'oats/express-router-factory': true,
  'oats/express-router-factories-type': true,
  'oats/express-app-router-factory': true,
  'oats/express-cors-router-factory': true,
  'oats/express-context-handler-factory': true,
}

export const clientOnlyConfig: PresetGeneratorConfiguration = {
  'oats/request-type': true,
  'oats/response-type': true,
  'oats/response-body-validator': true,
  'oats/cookie-serializer': true,
  'oats/set-cookie-deserializer': true,
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
  ...clientOnlyConfig,
  ...serverOnlyConfig,
})

export const presets = {
  client,
  server,
  fullStack,
}
