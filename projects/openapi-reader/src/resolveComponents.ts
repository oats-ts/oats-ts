import {
  ComponentsObject,
  HeaderObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from '@oats-ts/openapi-model'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { componentsObject } from './validators/componentsObject'
import { resolveSchemaObject } from './resolveSchemaObject'
import { resolveHeaderObject, resolveParameterObject } from './resolveParameterObject'
import { register } from './register'
import { resolveResponseObject } from './resolveResponseObject'
import { entries, isNil } from 'lodash'
import { registerNamed } from './registerNamed'
import { resolveRequestBodyObject } from './resolveRequestBodyObject'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveComponents(input: ReadInput<ComponentsObject>, context: ReadContext): Try<ComponentsObject> {
  const validationResult = validate(input, context, componentsObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { headers, parameters, responses, requestBodies, schemas } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(schemas)) {
    const schemasUri = context.uri.append(uri, 'schemas')
    register({ data: schemas, uri: schemasUri }, context)
    for (const [name, schemaOrRef] of entries(schemas)) {
      parts.push(
        context.ref.resolveReferenceable<SchemaObject>(
          { data: schemaOrRef, uri: context.uri.append(schemasUri, name) },
          context,
          resolveSchemaObject,
        ),
      )
      registerNamed(name, schemaOrRef, context)
    }
  }

  if (!isNil(parameters)) {
    const parametersUri = context.uri.append(uri, 'parameters')
    register({ data: parameters, uri: parametersUri }, context)
    for (const [name, paramOrRef] of entries(parameters)) {
      parts.push(
        context.ref.resolveReferenceable<ParameterObject>(
          { data: paramOrRef, uri: context.uri.append(parametersUri, name) },
          context,
          resolveParameterObject,
        ),
      )
      registerNamed(name, paramOrRef, context)
    }
  }

  if (!isNil(headers)) {
    const headersUri = context.uri.append(uri, 'headers')
    register({ data: headers, uri: headersUri }, context)
    for (const [name, headerOrRef] of entries(headers)) {
      parts.push(
        context.ref.resolveReferenceable<HeaderObject>(
          { data: headerOrRef, uri: context.uri.append(headersUri, name) },
          context,
          resolveHeaderObject,
        ),
      )
      registerNamed(name, headerOrRef, context)
    }
  }

  if (!isNil(responses)) {
    const responsesUri = context.uri.append(uri, 'responses')
    register({ data: responses, uri: responsesUri }, context)
    for (const [name, respOrRef] of entries(responses)) {
      parts.push(
        context.ref.resolveReferenceable<ResponseObject>(
          { data: respOrRef, uri: context.uri.append(responsesUri, name) },
          context,
          resolveResponseObject,
        ),
      )
      registerNamed(name, respOrRef, context)
    }
  }

  if (!isNil(requestBodies)) {
    const requestBodiesUri = context.uri.append(uri, 'requestBodies')
    register({ data: requestBodies, uri: requestBodiesUri }, context)
    for (const [name, reqOrRef] of entries(requestBodies)) {
      parts.push(
        context.ref.resolveReferenceable<RequestBodyObject>(
          { data: reqOrRef, uri: context.uri.append(requestBodiesUri, name) },
          context,
          resolveRequestBodyObject,
        ),
      )
      registerNamed(name, reqOrRef, context)
    }
  }
  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
