import { ComponentsObject, OpenAPIObject, OperationObject, ParameterObject, PathsObject } from '@oats-ts/openapi-model'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { entries, omit } from 'lodash'
import { ParameterGeneratorInput } from './typings'
import { configs } from './configs'
import { camelCase, components, getFieldName, getSchemas, parameterIssueSchema } from './schema'
import pascalCase from 'pascalcase'

function getParameterSchemaName({ location, style }: ParameterGeneratorInput): string {
  return `${pascalCase(style)}${pascalCase(location)}Parameters`
}

function generateParameterObjects({
  location,
  style,
  explodeValues,
  requiredValues,
  schemaTypes,
}: ParameterGeneratorInput): ParameterObject[] {
  const params: ParameterObject[] = []
  for (const schema of getSchemas(schemaTypes)) {
    for (const explode of explodeValues) {
      for (const required of requiredValues) {
        let name = camelCase(getFieldName(schema, !required), explode ? 'expl' : '')
        name = location === 'header' ? `X-${pascalCase(name)}-Header` : name
        const param: ParameterObject = {
          name,
          in: location,
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

function generateParametersSchema(input: ParameterGeneratorInput): SchemaObject {
  const { location, explodeValues, requiredValues, schemaTypes } = input
  const properties: Record<string, Referenceable<SchemaObject>> = {}
  const requiredProps: string[] = []
  for (const schema of getSchemas(schemaTypes)) {
    for (const explode of explodeValues) {
      for (const required of requiredValues) {
        let name = camelCase(getFieldName(schema, !required), explode ? 'expl' : '')
        name = location === 'header' ? `X-${pascalCase(name)}-Header` : name
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

function generateParameterOperationObject(input: ParameterGeneratorInput): OperationObject {
  return {
    operationId: `${input.style}${pascalCase(input.location)}Parameters`,
    description: `Endpoint for testing ${input.location} parameters with ${input.style} serialization`,
    parameters: generateParameterObjects(input),
    responses: {
      200: {
        description: `Successful response returning all the ${input.location} parameters in an object`,
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${getParameterSchemaName(input)}` },
          },
        },
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

function generateUrlTemplate(input: ParameterGeneratorInput, operation: OperationObject): string {
  const main = `${input.style}-${input.location}-parameters`
  const path = (operation.parameters || [])
    .filter((param: ParameterObject) => param.in === 'path')
    .map(({ name }: ParameterObject) => `{${name}}`)
  return ['', main, ...path].join('/')
}

function generatePathsObject(): PathsObject {
  return configs.reduce((paths: PathsObject, config: ParameterGeneratorInput) => {
    const operation = generateParameterOperationObject(config)
    const url = generateUrlTemplate(config, operation)
    return {
      ...paths,
      [url]: {
        get: operation,
      },
    }
  }, {})
}

function generateComponentsObject(): ComponentsObject {
  const schemas = configs.reduce((schemas: Record<string, SchemaObject>, config: ParameterGeneratorInput) => {
    const schema = generateParametersSchema(config)
    return { ...schemas, [schema.title as string]: omit(schema, ['title']) }
  }, {})
  return {
    schemas: {
      ...schemas,
      ...entries(components).reduce(
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
