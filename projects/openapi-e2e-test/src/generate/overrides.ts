import { OpenAPIFullStackPresetConfig } from '@oats-ts/openapi-generators'

export const overrides: Record<string, Partial<OpenAPIFullStackPresetConfig>> = {
  'schemas/pet-store-yaml.yaml': {
    cors: ['https://foo.com'],
  },
  'schemas/book-store.json': {
    cors: true,
  },
  'schemas/pet-store-json.json': {
    cors: true,
  },
  'generated-schemas/methods.json': {
    cors: true,
  },
  'generated-schemas/bodies.json': {
    cors: {
      getAllowedOrigins: () => false,
    },
  },
  'generated-schemas/parameters.json': {
    debugCookies: true,
    cors: {
      getAllowedOrigins: () => true,
      isCredentialsAllowed: (path: string) => {
        return path === '/form-cookie-parameters' ? true : undefined
      },
    },
  },
  'schemas/ignored-schemas.json': {
    // TODO
    // 'oats/type-guard': {
    //   ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
    // },
    // 'oats/type-validator': {
    //   ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
    // },
  },
}
