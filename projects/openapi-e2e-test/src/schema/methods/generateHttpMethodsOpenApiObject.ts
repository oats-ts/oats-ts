import { HttpMethod } from '@oats-ts/openapi-http'
import { OpenAPIObject, OperationObject, PathsObject } from '@oats-ts/openapi-model'
import { camelCase } from '../common/camelCase'

const methods: HttpMethod[] = ['get', 'post', 'put', 'patch', 'options', 'delete']

function generatePathsObject(): PathsObject {
  return methods.reduce((paths: PathsObject, method: HttpMethod): PathsObject => {
    const operation: OperationObject = {
      operationId: camelCase(method, 'method'),
      responses: {
        200: {
          description: `Endpoint using ${method} http method`,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['methodUsed'],
                properties: {
                  methodUsed: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    }
    return {
      ...paths,
      [`/${method}-method`]: {
        [method]: operation,
      },
    }
  }, {})
}

export function generateHttpMethodsOpenApiObject(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'HttpMethods',
      version: '1.0',
    },
    paths: generatePathsObject(),
  }
}
