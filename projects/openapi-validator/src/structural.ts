import { DiscriminatorObject, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import {
  ComponentsObject,
  MediaTypeObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  PathItemObject,
  RequestBodyObject,
  ResponseObject,
} from '@oats-ts/openapi-model'
import { Validator, SchemaRule, ShapeInput, validators } from '@oats-ts/validators'
import { entries } from 'lodash'

const {
  object,
  optional,
  shape,
  intersection,
  literal,
  restrictKeys,
  string,
  record,
  array,
  items,
  minLength,
  boolean,
  union,
  number,
  any,
  minProperties,
  maxProperties,
  integer,
} = validators

export const factories = {
  literalSchemaObject: () => {
    const schemaShape: ShapeInput<SchemaObject> = {
      type: optional(string()),
      const: union({
        string: string(),
        number: number(),
        boolean: boolean(),
        object: object(),
        array: array(),
        nil: optional(any()),
      }),
      description: optional(string()),
    }
    return object(intersection([shape<SchemaObject>(schemaShape), restrictKeys(Object.keys(schemaShape))]))
  },
  tupleSchemaObject: () => {
    const schemaShape: ShapeInput<SchemaObject> = {
      type: optional(literal('array')),
      description: optional(string()),
      minItems: optional(number()),
      prefixItems: optional(array(items(object()))),
    }
    return object(intersection([shape<SchemaObject>(schemaShape), restrictKeys(Object.keys(schemaShape))]))
  },
  arraySchemaObject: () => {
    const schemaShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      type: optional(literal('array')),
      items: object(),
    }
    return object(intersection([shape<SchemaObject>(schemaShape), restrictKeys(Object.keys(schemaShape))]))
  },
  discriminatedUnionSchemaObject: () => {
    const discUnionShape: ShapeInput<SchemaObject> = {
      type: optional(literal('object')),
      description: optional(string()),
      discriminator: object(
        shape<DiscriminatorObject>({
          propertyName: string(),
          mapping: optional(object(record(string(), string()))),
        }),
      ),
      oneOf: array(
        intersection([
          items(
            object(
              shape<ReferenceObject>({
                $ref: string(),
              }),
            ),
          ),
          minLength(1),
        ]),
      ),
    }

    return object(intersection([shape<SchemaObject>(discUnionShape), restrictKeys(Object.keys(discUnionShape))]))
  },
  enumSchemaObject: () => {
    const enumShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      type: optional(string()),
      enum: array(minLength(1)),
    }
    return object(intersection([shape<SchemaObject>(enumShape), restrictKeys(Object.keys(enumShape))]))
  },
  parameterEnumSchemaObject: () => {
    const enumShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      type: optional(
        union({
          integer: literal('integer'),
          number: literal('number'),
          string: literal('string'),
          boolean: literal('boolean'),
        }),
      ),
      enum: array(
        intersection([
          minLength(1),
          items(
            union({
              integer: integer(),
              number: number(),
              string: string(),
              boolean: boolean(),
            }),
          ),
        ]),
      ),
    }
    return object(intersection([shape<SchemaObject>(enumShape), restrictKeys(Object.keys(enumShape))]))
  },
  objectSchemaObject: () => {
    const objectSchemaShape: ShapeInput<SchemaObject> = {
      type: optional(literal('object')),
      required: optional(array(items(string()))),
      properties: optional(object()),
      description: optional(string()),
      additionalProperties: optional(literal(false)),
    }
    return object(intersection([shape<SchemaObject>(objectSchemaShape), restrictKeys(Object.keys(objectSchemaShape))]))
  },
  intersectionSchemaObject: () => {
    const intersectionShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      allOf: array(intersection([items(object()), minLength(1)])),
    }
    return object(intersection([shape<SchemaObject>(intersectionShape), restrictKeys(Object.keys(intersectionShape))]))
  },
  nonDiscriminatedUnionSchemaObject: () => {
    const nonDiscUnionShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      type: optional(literal('object')),
      oneOf: array(minLength(1)),
    }
    return object(intersection([shape<SchemaObject>(nonDiscUnionShape), restrictKeys(Object.keys(nonDiscUnionShape))]))
  },
  primitiveSchemaObject: () => {
    const primitiveShape: ShapeInput<SchemaObject> = {
      description: optional(string()),
      type: union({
        string: literal('string'),
        boolean: literal('boolean'),
        number: literal('number'),
        integer: literal('integer'),
      }),
    }
    return object(intersection([shape(primitiveShape), restrictKeys(Object.keys(primitiveShape))]))
  },
  recordSchemaObject: () => {
    const recordShape: ShapeInput<SchemaObject> = {
      type: optional(literal('object')),
      description: optional(string()),
      additionalProperties: object(),
    }
    return object(intersection([shape<SchemaObject>(recordShape), restrictKeys(Object.keys(recordShape))]))
  },
  referenceObject: () => {
    const refShape: ShapeInput<ReferenceObject> = { $ref: string() }
    return object(intersection([shape<ReferenceObject>(refShape), restrictKeys(Object.keys(refShape))]))
  },
  componentsObject: () => {
    return object(
      shape<ComponentsObject>({
        schemas: optional(object()),
        responses: optional(object()),
        parameters: optional(object()),
        requestBodies: optional(object()),
      }),
    )
  },
  contentObject: () => {
    return object(record(string(), object()))
  },
  mediaTypeObject: () => {
    const medieTypeShape: ShapeInput<MediaTypeObject> = { schema: optional(object()) }
    return object(intersection([shape<MediaTypeObject>(medieTypeShape), restrictKeys(Object.keys(medieTypeShape))]))
  },
  openApiObject: () => {
    return object(
      shape<OpenAPIObject>({
        paths: optional(object()),
        components: optional(object()),
      }),
    )
  },
  pathsObject: () => {
    return object(record(string(), object()))
  },
  pathItemObject: () => {
    const pathItemShape: ShapeInput<PathItemObject> = {
      get: optional(object()),
      put: optional(object()),
      post: optional(object()),
      delete: optional(object()),
      options: optional(object()),
      head: optional(object()),
      patch: optional(object()),
      parameters: optional(array()),
    }
    return object(intersection([shape<PathItemObject>(pathItemShape), restrictKeys(Object.keys(pathItemShape))]))
  },
  operationObject: () => {
    const operationShape: ShapeInput<OperationObject> = {
      description: optional(string()),
      summary: optional(string()),
      operationId: optional(string()),
      parameters: optional(array()),
      requestBody: optional(object()),
      responses: object(record(string(), object())),
    }
    return object(intersection([shape<OperationObject>(operationShape), restrictKeys(Object.keys(operationShape))]))
  },
  requestBodyObject: () => {
    const requestBodyShape: ShapeInput<RequestBodyObject> = {
      description: optional(string()),
      content: optional(object(record(string(), object()))),
      required: optional(boolean()),
    }
    return object(
      intersection([shape<RequestBodyObject>(requestBodyShape), restrictKeys(Object.keys(requestBodyShape))]),
    )
  },
  responsesObject: () => {
    const responsesKey = union({
      default: literal('default'),
      '1XX': literal('1XX'),
      '2XX': literal('2XX'),
      '3XX': literal('3XX'),
      '4XX': literal('4XX'),
      '5XX': literal('5XX'),
      integer: string(),
    })
    return object(record(responsesKey, object()))
  },
  responseObject: () => {
    const responseShape: ShapeInput<ResponseObject> = {
      content: optional(object(record(string(), object()))),
      headers: optional(object(record(string(), object()))),
      description: optional(string()),
    }
    return object(intersection([shape<ResponseObject>(responseShape), restrictKeys(Object.keys(responseShape))]))
  },
  contentParameterObject: () => {
    const contentParameterObject: ShapeInput<ParameterObject> = {
      name: string(),
      in: union({
        cookie: literal('cookie'),
        header: literal('header'),
        path: literal('path'),
        query: literal('query'),
      }),
      required: optional(boolean()),
      description: optional(string()),
      content: object(intersection([record(string(), object()), minProperties(1), maxProperties(1)])),
    }
    return object(
      intersection([shape<ParameterObject>(contentParameterObject), restrictKeys(Object.keys(contentParameterObject))]),
    )
  },
  cookieParameterObject: () => {
    const cookieParamShape: ShapeInput<ParameterObject> = {
      name: string(),
      in: literal('cookie'),
      required: optional(boolean()),
      style: optional(literal('form')),
      explode: optional(literal(false)),
      description: optional(string()),
      schema: object(),
    }
    return object(intersection([shape<ParameterObject>(cookieParamShape), restrictKeys(Object.keys(cookieParamShape))]))
  },
  headerParameterObject: () => {
    const headerParamShape: ShapeInput<ParameterObject> = {
      name: string(),
      in: literal('header'),
      required: optional(boolean()),
      style: optional(literal('simple')),
      explode: optional(boolean()),
      description: optional(string()),
      schema: object(),
    }
    return object(intersection([shape<ParameterObject>(headerParamShape), restrictKeys(Object.keys(headerParamShape))]))
  },
  pathParameterObject: () => {
    const pathParamShape: ShapeInput<ParameterObject> = {
      name: string(),
      in: literal('path'),
      required: literal(true),
      explode: optional(boolean()),
      description: optional(string()),
      style: optional(
        union({
          simple: literal('simple'),
          label: literal('label'),
          matrix: literal('matrix'),
        }),
      ),
      schema: object(),
    }
    return object(intersection([shape<ParameterObject>(pathParamShape), restrictKeys(Object.keys(pathParamShape))]))
  },
  queryParameterObject: () => {
    const queryParamShape: ShapeInput<ParameterObject> = {
      name: string(),
      in: literal('query'),
      required: optional(boolean()),
      explode: optional(boolean()),
      description: optional(string()),
      style: optional(
        union({
          form: literal('form'),
          spaceDelimited: literal('spaceDelimited'),
          pipeDelimited: literal('pipeDelimited'),
          deepObject: literal('deepObject'),
        }),
      ),
      schema: object(),
    }
    return object(intersection([shape<ParameterObject>(queryParamShape), restrictKeys(Object.keys(queryParamShape))]))
  },
  headersObject: () => {
    return object(record(string(), object()))
  },
  headerObject: () => {
    return object(/* TODO */)
  },
} as const

export type StructuralValidators = Record<keyof typeof factories, () => SchemaRule>

export const structural = entries(factories).reduce(
  (validatorsObject, [name, factory]) => ({ ...validatorsObject, [name]: factory() }),
  {} as Record<keyof typeof factories, Validator<any>>,
)
