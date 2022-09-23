import { merge } from 'lodash'
import { createPreset } from './createPreset'
import { BasePresetConfiguration, PresetGeneratorConfiguration } from './types'

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
  'oats/express-router': true,
  'oats/express-routers-type': true,
  'oats/express-router-factory': true,
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

export type ServerPresetConfiguration = BasePresetConfiguration

const server = createPreset<Partial<ServerPresetConfiguration>>(
  'server',
  {
    ...commonConfig,
    ...serverOnlyConfig,
  },
  (base, config) => merge(base, config?.overrides ?? {}),
)

export type ClientPresetConfiguration = BasePresetConfiguration & {
  sendCookieHeader?: boolean
  parseSetCookieHeaders?: boolean
}

const client = createPreset<ClientPresetConfiguration>(
  'client',
  {
    ...commonConfig,
    ...clientOnlyConfig,
  },
  (base, config) =>
    merge(
      base,
      {
        'oats/operation': {
          sendCookieHeader: config?.sendCookieHeader,
          parseSetCookieHeaders: config?.parseSetCookieHeaders,
        },
        'oats/request-type': {
          cookies: Boolean(config?.sendCookieHeader),
        },
        'oats/response-type': {
          cookies: Boolean(config?.parseSetCookieHeaders),
        },
      },
      config?.overrides ?? {},
    ),
)

export type FullStackPresetConfiguration = BasePresetConfiguration & {
  sendCookieHeader?: boolean
  parseSetCookieHeaders?: boolean
}

const fullStack = createPreset<FullStackPresetConfiguration>(
  'full-stack',
  {
    ...commonConfig,
    ...clientOnlyConfig,
    ...serverOnlyConfig,
  },
  (base, config) =>
    merge(
      base,
      {
        'oats/operation': {
          sendCookieHeader: config?.sendCookieHeader,
          parseSetCookieHeaders: config?.parseSetCookieHeaders,
        },
        'oats/request-type': {
          cookies: Boolean(config?.sendCookieHeader),
        },
        'oats/response-type': {
          cookies: Boolean(config?.parseSetCookieHeaders),
        },
      },
      config?.overrides ?? {},
    ),
)

export const presets = {
  client,
  server,
  fullStack,
}
