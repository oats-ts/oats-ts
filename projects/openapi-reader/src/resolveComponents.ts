import {
  ComponentsObject,
  HeaderObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
  SchemaObject,
} from 'openapi3-ts'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { componentsObject } from './validators/componentsObject'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'
import { resolveHeaderObject, resolveParameterObject } from './resolveParameterObject'
import { register } from './register'
import { resolveResponseObject } from './resolveResponseObject'
import { entries, isNil } from 'lodash'
import { registerNamed } from './registerNamed'
import { resolveRequestBodyObject } from './resolveRequestBodyObject'

export async function resolveComponents(input: ReadInput<ComponentsObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, componentsObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { headers, parameters, responses, requestBodies, schemas } = data

  if (!isNil(schemas)) {
    const schemasUri = context.uri.append(uri, 'schemas')
    register({ data: schemas, uri: schemasUri }, context)
    for (const [name, schemaOrRef] of entries(schemas)) {
      await resolveReferenceable<SchemaObject>(
        { data: schemaOrRef, uri: context.uri.append(schemasUri, name) },
        context,
        resolveSchemaObject,
      )
      registerNamed(name, schemaOrRef, context)
    }
  }

  if (!isNil(parameters)) {
    const parametersUri = context.uri.append(uri, 'parameters')
    register({ data: parameters, uri: parametersUri }, context)
    for (const [name, paramOrRef] of entries(parameters)) {
      await resolveReferenceable<ParameterObject>(
        { data: paramOrRef, uri: context.uri.append(parametersUri, name) },
        context,
        resolveParameterObject,
      )
      registerNamed(name, paramOrRef, context)
    }
  }

  if (!isNil(headers)) {
    const headersUri = context.uri.append(uri, 'headers')
    register({ data: headers, uri: headersUri }, context)
    for (const [name, headerOrRef] of entries(headers)) {
      await resolveReferenceable<HeaderObject>(
        { data: headerOrRef, uri: context.uri.append(headersUri, name) },
        context,
        resolveHeaderObject,
      )
      registerNamed(name, headerOrRef, context)
    }
  }

  if (!isNil(responses)) {
    const responsesUri = context.uri.append(uri, 'responses')
    register({ data: responses, uri: responsesUri }, context)
    for (const [name, respOrRef] of entries(responses)) {
      await resolveReferenceable<ResponseObject>(
        { data: respOrRef, uri: context.uri.append(responsesUri, name) },
        context,
        resolveResponseObject,
      )
      registerNamed(name, respOrRef, context)
    }
  }

  if (!isNil(requestBodies)) {
    const requestBodiesUri = context.uri.append(uri, 'requestBodies')
    register({ data: requestBodies, uri: requestBodiesUri }, context)
    for (const [name, reqOrRef] of entries(requestBodies)) {
      await resolveReferenceable<RequestBodyObject>(
        { data: reqOrRef, uri: context.uri.append(requestBodiesUri, name) },
        context,
        resolveRequestBodyObject,
      )
      registerNamed(name, reqOrRef, context)
    }
  }
}
