import { PresetGeneratorConfiguration } from '@oats-ts/openapi-generators'

export const overrides: Record<string, Partial<PresetGeneratorConfiguration>> = {
  'schemas/pet-store-yaml.yaml': {
    'oats/express-cors-router-factory': { getAllowedOrigins: () => ['https://foo.com'] },
    'oats/express-router-factory': { getAllowedOrigins: () => ['https://foo.com'] },
  },
  'schemas/pet-store-json.json': {
    'oats/express-cors-router-factory': { getAllowedOrigins: () => true },
    'oats/express-router-factory': { getAllowedOrigins: () => true },
  },
  'generated-schemas/parameters.json': {
    'oats/operation': {
      sendCookieHeader: true,
      parseSetCookieHeaders: true,
    },
    'oats/response-type': {
      cookies: true,
    },
    'oats/request-type': {
      cookies: true,
    },
    'oats/express-cors-router-factory': {
      getAllowedOrigins: () => true,
      isResponseHeaderAllowed: () => true,
      isCredentialsAllowed: (url: string) => {
        return url === '/form-cookie-parameters' ? true : undefined
      },
    },
    'oats/express-router-factory': {
      getAllowedOrigins: () => true,
      isResponseHeaderAllowed: () => true,
      isCredentialsAllowed: (url: string) => {
        return url === '/form-cookie-parameters' ? true : undefined
      },
    },
  },
  'schemas/ignored-schemas.json': {
    'oats/type-guard': {
      ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
    },
    'oats/type-validator': {
      ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
    },
  },
}
