import { DiscriminatorObject, SchemaObject } from '@oats-ts/json-schema-model'
import {
  BaseParameterObject,
  ComponentsObject,
  HeaderObject,
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  RequestBodyObject,
  ResponseObject,
} from '@oats-ts/openapi-model'
import { Validator, validators as v } from '@oats-ts/validators'

const { shape, object, optional, record, string, array, items, boolean, any, literal, union, number } = v

const recordOfObjects = object(record(string(), object()))

const baseParameterObjectFileds: Record<keyof BaseParameterObject, Validator<any>> = {
  description: optional(string()),
  required: optional(boolean()),
  deprecated: optional(boolean()),
  allowEmptyValue: optional(boolean()),
  style: optional(
    union({
      matrix: literal('matrix'),
      label: literal('label'),
      form: literal('form'),
      simple: literal('simple'),
      spaceDelimited: literal('spaceDelimited'),
      pipeDelimited: literal('pipeDelimited'),
      deepObject: literal('deepObject'),
    }),
  ),
  explode: optional(boolean()),
  allowReserved: optional(boolean()),
  schema: optional(object()),
  examples: optional(any()),
  example: optional(any()),
  content: optional(object()),
}

export const validators = {
  openApiObject: object(
    shape<OpenAPIObject>({
      openapi: string(),
      info: object(),
      servers: optional(array(items(object()))),
      paths: optional(object()),
      components: optional(object()),
      security: optional(array(items(object()))),
      tags: optional(array(items(object()))),
      externalDocs: optional(object()),
    }),
  ),
  componentsObject: object(
    shape<ComponentsObject>({
      schemas: optional(recordOfObjects),
      responses: optional(recordOfObjects),
      parameters: optional(recordOfObjects),
      examples: optional(any()),
      requestBodies: optional(recordOfObjects),
      headers: optional(recordOfObjects),
      securitySchemes: optional(recordOfObjects),
      links: optional(recordOfObjects),
      callbacks: optional(recordOfObjects),
    }),
  ),
  discriminatorObject: object(
    shape<DiscriminatorObject>({
      mapping: optional(object()),
      propertyName: string(),
    }),
  ),
  mediaTypeObject: object(
    shape<MediaTypeObject>({
      schema: optional(object()),
      examples: optional(any()),
      example: optional(any()),
      encoding: optional(object()),
    }),
  ),
  operationObject: object(
    shape<OperationObject>({
      tags: optional(array(items(string()))),
      summary: optional(string()),
      description: optional(string()),
      externalDocs: optional(object()),
      operationId: optional(string()),
      parameters: optional(array(items(object()))),
      requestBody: optional(object()),
      responses: optional(object()),
      callbacks: optional(object()),
      deprecated: optional(boolean()),
      security: optional(array(items(object()))),
      servers: optional(array(items(object()))),
    }),
  ),
  headerObject: object(shape<HeaderObject>(baseParameterObjectFileds)),
  parameterObject: object(
    shape<ParameterObject>({
      ...baseParameterObjectFileds,
      name: string(),
      in: union({
        query: literal('query'),
        header: literal('header'),
        path: literal('path'),
        cookie: literal('cookie'),
      }),
    }),
  ),
  pathItemObject: object(
    shape<PathItemObject>({
      $ref: optional(string()),
      description: optional(string()),
      summary: optional(string()),
      delete: optional(object()),
      get: optional(object()),
      head: optional(object()),
      options: optional(object()),
      patch: optional(object()),
      post: optional(object()),
      put: optional(object()),
      trace: optional(object()),
      parameters: optional(array(items(object()))),
      servers: optional(array(items(object()))),
    }),
  ),
  pathsObject: object(record(string(), object())),
  referenceObject: object(shape({ $ref: string() })),
  requestBodyObject: object(
    shape<RequestBodyObject>({
      description: optional(string()),
      content: optional(object()),
      required: optional(boolean()),
    }),
  ),
  responseObject: object(
    shape<ResponseObject>({
      description: optional(string()),
      content: optional(object()),
      headers: optional(object()),
      links: optional(object()),
    }),
  ),
  schemaObject: object(
    shape<SchemaObject>({
      type: optional(string()),
      format: optional(string()),
      deprecated: optional(boolean()),
      multipleOf: optional(number()),
      maximum: optional(number()),
      exclusiveMaximum: optional(boolean()),
      minimum: optional(number()),
      exclusiveMinimum: optional(boolean()),
      maxLength: optional(number()),
      minLength: optional(number()),
      pattern: optional(string()),
      maxItems: optional(number()),
      minItems: optional(number()),
      uniqueItems: optional(boolean()),
      description: optional(string()),
      required: optional(array(items(string()))),
      enum: optional(array()),
      discriminator: optional(object()),
      properties: optional(object()),
      allOf: optional(array(items(object()))),
      oneOf: optional(array(items(object()))),
      anyOf: optional(array(items(object()))),
      items: optional(
        union({
          object: object(),
          boolean: boolean(),
        }),
      ),
      additionalProperties: optional(
        union({
          schema: object(),
          boolean: boolean(),
        }),
      ),
      default: optional(any()),
      examples: optional(any()),
      externalDocs: optional(object()),
      maxProperties: optional(number()),
      minProperties: optional(number()),
      not: optional(object()),
      readOnly: optional(boolean()),
      title: optional(string()),
      writeOnly: optional(boolean()),
      if: optional(object()),
      then: optional(object()),
      else: optional(object()),
      contains: optional(object()),
      patternProperties: optional(object(record(string(), object()))),
      prefixItems: optional(array()),
      propertyNames: optional(object()),
      const: optional(any()),
    }),
  ),
  contentObject: recordOfObjects,
} as const
