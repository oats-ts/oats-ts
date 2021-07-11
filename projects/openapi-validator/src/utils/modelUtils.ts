import {
  PathItemObject,
  OperationObject,
  ParameterObject,
  ComponentsObject,
  SchemaObject,
  ResponseObject,
  RequestBodyObject,
} from 'openapi3-ts'
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
  const { dereference } = context
  const { parameters } = data
  const unresolved = isNil(parameters) ? [] : Array.isArray(parameters) ? parameters : values(parameters)
  return unresolved.map(dereference)
}

export function schemasOf(data: ComponentsObject, context: OpenAPIValidatorContext): SchemaObject[] {
  const { dereference } = context
  return values(data.schemas || {}).map(dereference)
}

export function responsesOf(data: ComponentsObject, context: OpenAPIValidatorContext): ResponseObject[] {
  const { dereference } = context
  return values(data.responses || {}).map(dereference)
}

export function requestBodiesOf(data: ComponentsObject, context: OpenAPIValidatorContext): RequestBodyObject[] {
  const { dereference } = context
  return values(data.requestBodies || {}).map(dereference)
}
