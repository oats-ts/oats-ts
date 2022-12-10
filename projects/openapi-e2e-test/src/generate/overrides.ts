import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIFullStackPresetConfig, OpenAPIPresetConfig } from '@oats-ts/openapi-generators'

export const presetConfigs: Record<string, Partial<OpenAPIFullStackPresetConfig>> = {
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
  'generated-schemas/content-parameters.json': {
    debugCookies: true,
  },
  'schemas/cookies.json': {
    debugCookies: true,
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

export const importReplacers: Record<string, GeneratorConfig['importReplacer']> = {
  'generated-schemas/parameters.json': (_, importName) => `_${importName}`,
}

export const localNameProviders: Record<string, GeneratorConfig['localNameProvider']> = {
  'schemas/pet-store-json.json': (_input, _target, _local, defaultName) => `_local_${defaultName}`,
}

export const overrides: Record<string, OpenAPIPresetConfig> = {
  'edge-cases/mega-enum.yaml': {
    'oats/type-guard': false,
  },
}
