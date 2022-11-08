import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIFullStackPresetConfig } from '@oats-ts/openapi-generators'

export const presetOverrides: Record<string, Partial<OpenAPIFullStackPresetConfig>> = {
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
    ignoreTypeGuard: (schema: any) => {
      return Boolean(schema?.['x-ignore'])
    },
    ignoreValidator: (schema: any) => {
      return Boolean(schema?.['x-ignore'])
    },
  },
}

export const importReplacerOverrides: Record<string, GeneratorConfig['importReplacer']> = {
  'generated-schemas/parameters.json': (_, importName) => `_${importName}`,
}

export const localNameProviderOverrides: Record<string, GeneratorConfig['localNameProvider']> = {
  'schemas/pet-store-json.json': (_input, _target, _local, defaultName) => `_local_${defaultName}`,
}
