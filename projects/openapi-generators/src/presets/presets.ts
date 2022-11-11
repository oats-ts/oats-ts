import { isNil } from 'lodash'
import { CorsConfigurationGeneratorConfig } from '../cors-configuration/typings'
import { OpenAPIPresetGenerator } from './OpenAPIPresetGenerator'
import {
  OpenAPIClientPresetConfig,
  OpenAPICommonPresetConfig,
  OpenAPIFullStackPresetConfig,
  OpenAPIPresetConfig,
  OpenAPIServerPresetConfig,
} from './types'

function getCorsConfiguration(
  cors: OpenAPIServerPresetConfig['cors'],
): Partial<CorsConfigurationGeneratorConfig> | false {
  if (isNil(cors)) {
    return false
  } else if (typeof cors === 'boolean') {
    return cors === false ? false : { getAllowedOrigins: () => true }
  } else if (Array.isArray(cors)) {
    return { getAllowedOrigins: () => cors }
  }
  return cors
}

function commonConfig(config: OpenAPICommonPresetConfig): OpenAPIPresetConfig {
  const { documentation, ignoreTypeGuard, ignoreValidator } = config
  return {
    'oats/type': isNil(documentation) ? true : { documentation: documentation },
    'oats/type-validator': isNil(ignoreValidator) ? true : { ignore: ignoreValidator },
    'oats/type-guard': isNil(ignoreTypeGuard) ? true : { ignore: ignoreTypeGuard },
    'oats/query-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/path-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/request-headers-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/response-headers-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/cookies-type': isNil(documentation) ? true : { documentation: documentation },
  }
}

function serverConfig(config: OpenAPIServerPresetConfig): OpenAPIPresetConfig {
  const { cors, documentation } = config
  const shouldGenerateCors = !isNil(cors)
  return {
    'oats/request-server-type': true,
    'oats/response-server-type': true,
    'oats/request-body-validator': true,
    'oats/cookie-deserializer': true,
    'oats/set-cookie-serializer': true,
    'oats/response-headers-serializer': true,
    'oats/path-deserializer': true,
    'oats/query-deserializer': true,
    'oats/request-headers-deserializer': true,
    'oats/api-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/express-router-factory': { cors: shouldGenerateCors },
    'oats/express-router-factories-type': true,
    'oats/express-app-router-factory': true,
    'oats/express-cors-router-factory': shouldGenerateCors,
    'oats/express-context-router-factory': true,
    'oats/cors-configuration': shouldGenerateCors ? getCorsConfiguration(cors) : false,
  }
}

function clientConfig(config: OpenAPIClientPresetConfig = {}): OpenAPIPresetConfig {
  const { debugCookies, documentation, validateResponses } = config
  return {
    'oats/request-type': isNil(debugCookies) ? true : { cookies: debugCookies },
    'oats/response-type': isNil(debugCookies) ? true : { cookies: debugCookies },
    'oats/response-body-validator': true,
    'oats/cookie-serializer': true,
    'oats/set-cookie-deserializer': true,
    'oats/response-headers-deserializer': true,
    'oats/path-serializer': true,
    'oats/query-serializer': true,
    'oats/request-headers-serializer': true,
    'oats/operation': {
      ...(isNil(documentation) ? {} : { documentation: documentation }),
      ...(isNil(debugCookies) ? {} : { parseSetCookieHeaders: debugCookies, sendCookieHeader: debugCookies }),
      ...(isNil(validateResponses) ? {} : { validate: validateResponses }),
    },
    'oats/sdk-type': isNil(documentation) ? true : { documentation: documentation },
    'oats/sdk-impl': isNil(documentation) ? true : { documentation: documentation },
  }
}

export function server(config: OpenAPIServerPresetConfig = {}): OpenAPIPresetGenerator {
  return new OpenAPIPresetGenerator('server', {
    ...commonConfig(config),
    ...serverConfig(config),
  })
}

export function client(config: OpenAPIClientPresetConfig = {}): OpenAPIPresetGenerator {
  return new OpenAPIPresetGenerator('server', {
    ...commonConfig(config),
    ...clientConfig(config),
  })
}

export function fullStack(config: OpenAPIFullStackPresetConfig = {}): OpenAPIPresetGenerator {
  return new OpenAPIPresetGenerator('full stack', {
    ...commonConfig(config),
    ...serverConfig(config),
    ...clientConfig(config),
  })
}

export const presets = {
  client,
  server,
  fullStack,
}
