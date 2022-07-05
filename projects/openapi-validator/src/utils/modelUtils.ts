import {
  PathItemObject,
  OperationObject,
  ParameterObject,
  ComponentsObject,
  ResponseObject,
  RequestBodyObject,
} from '@oats-ts/openapi-model'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { isNil, negate, values } from 'lodash'
import { OpenAPIValidatorContext } from '../typings'

export function operationsOf(data: PathItemObject): OperationObject[] {
  const { get, put, post, delete: _delete, options, head, patch } = data
  return [get, put, post, _delete, options, head, patch].filter(negate(isNil))
}

export function parametersOf(
  data: OperationObject | PathItemObject | ComponentsObject,
  context: OpenAPIValidatorContext,
): ParameterObject[] {
  const { parameters } = data
  const unresolved = isNil(parameters) ? [] : Array.isArray(parameters) ? parameters : values(parameters)
  return unresolved.map((parameter) => context.dereference(parameter))
}

export function schemasOf(data: ComponentsObject, context: OpenAPIValidatorContext): SchemaObject[] {
  return values(data.schemas || {}).map((schema) => context.dereference(schema))
}

export function responsesOf(data: ComponentsObject, context: OpenAPIValidatorContext): ResponseObject[] {
  return values(data.responses || {}).map((response) => context.dereference(response))
}

export function requestBodiesOf(data: ComponentsObject, context: OpenAPIValidatorContext): RequestBodyObject[] {
  return values(data.requestBodies || {}).map((body) => context.dereference(body))
}
