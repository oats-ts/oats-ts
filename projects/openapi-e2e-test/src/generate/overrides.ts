import { PresetGeneratorConfiguration } from '@oats-ts/openapi-generators'

export const overrides: Record<string, Partial<PresetGeneratorConfiguration>> = {
  'schemas/pet-store-yaml.yaml': {
    'oats/cors-configuration': { getAllowedOrigins: () => ['https://foo.com'] },
    'oats/express-router-factory': { cors: true },
  },
  'schemas/book-store.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
    'oats/express-router-factory': { cors: true },
  },
  'schemas/pet-store-json.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
    'oats/express-router-factory': { cors: true },
  },
  'generated-schemas/methods.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
    'oats/express-router-factory': { cors: true },
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
    'oats/express-router-factory': { cors: true },
    'oats/cors-configuration': {
      getAllowedOrigins: () => true,
      isCredentialsAllowed: (path: string) => {
        return path === '/form-cookie-parameters' ? true : undefined
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
