import {
  ComponentsObject,
  ContentObject,
  HeaderObject,
  HeadersObject,
  OpenAPIObject,
  OperationObject,
  ParameterLocation,
  ParameterObject,
  PathsObject,
  RequestBodyObject,
} from '@oats-ts/openapi-model'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { entries, omit } from 'lodash'
import { ParameterGeneratorConfig } from './typings'
import { configs } from './configs'
import { registry, parameterIssueSchema } from './schema'
import pascalCase from 'pascalcase'
import { getFieldName, getSchema } from './schemaUtils'
import { camelCase } from '../common/camelCase'

function getParameterSchemaName({ location, style }: ParameterGeneratorConfig): string {
  return `${pascalCase(style)}${pascalCase(location)}Parameters`
}

function generateParameterObjects({
  location,
  style,
  explodeValues,
  requiredValues,
  schemaTypes,
}: ParameterGeneratorConfig): ParameterObject[] {
  const params: ParameterObject[] = []
  for (const schemaType of schemaTypes) {
    for (const explode of explodeValues) {
      for (const required of requiredValues) {
        const schema = getSchema(schemaType, required, explode)
        let name = camelCase(getFieldName(schema, !required), explode ? 'expl' : '')
        name = location === 'header' || location === 'response-header' ? `X-${pascalCase(name)}-Header` : name
        const param: ParameterObject = {
          name,
          in: location as ParameterLocation,
          style,
          explode,
          required,
          schema,
        }
        params.push(param)
      }
    }
  }
  return params
}

function generateResponseHeaders({
  location,
  style,
  explodeValues,
  requiredValues,
  schemaTypes,
}: ParameterGeneratorConfig): HeadersObject {
  const headers: HeadersObject = {}
  for (const schemaType of schemaTypes) {
    for (const explode of explodeValues) {
      for (const required of requiredValues) {
        const schema = getSchema(schemaType, required, explode)
        let name = camelCase(getFieldName(schema, !required), explode ? 'expl' : '')
        name = location === 'header' || location === 'response-header' ? `X-${pascalCase(name)}-Header` : name
        const param: HeaderObject = {
          style,
          explode,
          required,
          schema,
        }
        headers[name] = param
      }
    }
  }
  return headers
}

function generateParametersSchema(input: ParameterGeneratorConfig): SchemaObject {
  const { location, explodeValues, requiredValues, schemaTypes } = input
  const properties: Record<string, Referenceable<SchemaObject>> = {}
  const requiredProps: string[] = []
  for (const schemaType of schemaTypes) {
    for (const explode of explodeValues) {
      for (const required of requiredValues) {
        const schema = getSchema(schemaType, required, explode)
        let name = camelCase(getFieldName(schema, !required), explode ? 'expl' : '')
        name = location === 'header' || location === 'response-header' ? `X-${pascalCase(name)}-Header` : name
        properties[name] = schema
        if (required) {
          requiredProps.push(name)
        }
      }
    }
  }
  return {
    type: 'object',
    title: getParameterSchemaName(input),
    required: requiredProps,
    properties,
  }
}

function generateParameterOperationObject(input: ParameterGeneratorConfig): OperationObject {
  const parameters = input.location === 'response-header' ? [] : generateParameterObjects(input)
  const headers = input.location === 'response-header' ? generateResponseHeaders(input) : undefined
  const content: ContentObject = {
    'application/json': {
      schema:
        input.location === 'response-header'
          ? { type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } }
          : { $ref: `#/components/schemas/${getParameterSchemaName(input)}` },
    },
  }
  const requestBody: RequestBodyObject | undefined =
    input.location === 'response-header'
      ? {
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${getParameterSchemaName(input)}` },
            },
          },
        }
      : undefined

  return {
    operationId: `${input.style}${pascalCase(input.location)}Parameters`,
    description: `Endpoint for testing ${input.location} parameters with ${input.style} serialization`,
    parameters,
    requestBody,
    responses: {
      200: {
        description: `Successful response returning all the ${input.location} parameters in an object`,
        content,
        headers,
      },
      400: {
        description: `Error response on wrong data`,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: parameterIssueSchema,
            },
          },
        },
      },
    },
  }
}

function generateUrlTemplate(input: ParameterGeneratorConfig, operation: OperationObject): string {
  const main = `${input.style}-${input.location}-parameters`
  const path = (operation.parameters || [])
    .filter((param: ParameterObject) => param.in === 'path')
    .map(({ name }: ParameterObject) => `{${name}}`)
  return ['', main, ...path].join('/')
}

function generatePathsObject(): PathsObject {
  return configs.reduce((paths: PathsObject, config: ParameterGeneratorConfig) => {
    const operation = generateParameterOperationObject(config)
    const url = generateUrlTemplate(config, operation)
    return {
      ...paths,
      [url]: {
        [config.location === 'response-header' ? 'post' : 'get']: operation,
      },
    }
  }, {})
}

function generateComponentsObject(): ComponentsObject {
  const schemas = configs.reduce((schemas: Record<string, SchemaObject>, config: ParameterGeneratorConfig) => {
    const schema = generateParametersSchema(config)
    return { ...schemas, [schema.title as string]: omit(schema, ['title']) }
  }, {})
  return {
    schemas: {
      ...schemas,
      ...entries(registry).reduce(
        (schemas: Record<string, SchemaObject>, [name, provider]) => ({
          ...schemas,
          [name]: provider(),
        }),
        {},
      ),
    },
  }
}

export function generateParametersOpenApiObject(): OpenAPIObject {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Parameters',
      version: '1.0',
    },
    paths: generatePathsObject(),
    components: generateComponentsObject(),
  }
}
