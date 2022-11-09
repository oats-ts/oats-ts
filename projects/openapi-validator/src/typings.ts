import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { Issue } from '@oats-ts/validators'
import {
  OpenAPIObject,
  PathsObject,
  PathItemObject,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  HeaderObject,
  ResponsesObject,
  ContentObject,
} from '@oats-ts/openapi-model'
import { JsonSchemaBasedGeneratorContext } from '@oats-ts/model-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'

export type OpenAPIValidatorFn<T> = (
  input: T,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
) => Issue[]

export type OpenAPIValidatorConfig = {
  openApiObject: OpenAPIValidatorFn<OpenAPIObject>
  pathsObject: OpenAPIValidatorFn<PathsObject>
  pathItemObject: OpenAPIValidatorFn<PathItemObject>
  operationObject: OpenAPIValidatorFn<OperationObject>
  parameterObject: OpenAPIValidatorFn<ParameterObject>
  requestBodyObject: OpenAPIValidatorFn<RequestBodyObject>
  responseObject: OpenAPIValidatorFn<ResponseObject>
  schemaObject: OpenAPIValidatorFn<SchemaObject>
  componentsObject: OpenAPIValidatorFn<HeaderObject>
  responsesObject: OpenAPIValidatorFn<ResponsesObject>
  contentObject: OpenAPIValidatorFn<ContentObject>
  referenceObject: OpenAPIValidatorFn<ReferenceObject>
}

export type OpenAPIValidatorContext = JsonSchemaBasedGeneratorContext<OpenAPIObject, OpenAPIGeneratorTarget> & {
  readonly validated: Set<any>
}
