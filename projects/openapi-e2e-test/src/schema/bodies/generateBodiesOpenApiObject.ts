import { SchemaObject } from '@oats-ts/json-schema-model'
import { ComponentsObject, OpenAPIObject, PathsObject } from '@oats-ts/openapi-model'
import { entries } from 'lodash'
import { camelCase } from '../common/camelCase'
import { registry, schemas } from './schemas'

function getComponents(): ComponentsObject {
  return {
    schemas: entries(registry).reduce((s: Record<string, SchemaObject>, [name, schema]) => {
      return { ...s, [name]: schema() }
    }, {}),
  }
}

function getPaths(): PathsObject {
  return entries(schemas).reduce((paths: PathsObject, [name, schema]) => {
    return {
      ...paths,
      [`/${name}`]: {
        post: {
          operationId: camelCase(name),
          requestBody: {
            content: {
              'application/json': {
                schema,
              },
              'application/yaml': {
                schema,
              },
            },
          },
          responses: {
            200: {
              description: `Response for content ${name}.`,
              content: {
                'application/json': {
                  schema,
                },
                'application/yaml': {
                  schema,
                },
              },
            },
          },
        },
      },
    }
  }, {})
}

export function generateBodiesOpenApiObject(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Bodies',
      version: '1.0',
    },
    components: getComponents(),
    paths: getPaths(),
  }
}
