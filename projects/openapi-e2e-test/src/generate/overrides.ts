import { PresetGeneratorConfiguration } from '@oats-ts/openapi-generators'

export const overrides: Record<string, Partial<PresetGeneratorConfiguration>> = {
  'schemas/pet-store-yaml.yaml': {
    'oats/cors-configuration': { getAllowedOrigins: () => ['https://foo.com'] },
  },
  'schemas/book-store.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
  },
  'schemas/pet-store-json.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
  },
  'generated-schemas/methods.json': {
    'oats/cors-configuration': { getAllowedOrigins: () => true },
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
    'oats/cors-configuration': {
      getAllowedOrigins: () => true,
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
