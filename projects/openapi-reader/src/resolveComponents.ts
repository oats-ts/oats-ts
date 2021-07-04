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
    for (const [name, schemaOrRef] of entries(schemas)) {
      await resolveReferenceable<SchemaObject>(
        { data: schemaOrRef, uri: context.uri.append(uri, 'schemas', name) },
        context,
        resolveSchemaObject,
      )
      registerNamed(name, schemaOrRef, context)
    }
  }

  if (!isNil(parameters)) {
    for (const [name, paramOrRef] of entries(parameters)) {
      await resolveReferenceable<ParameterObject>(
        { data: paramOrRef, uri: context.uri.append(uri, 'parameters', name) },
        context,
        resolveParameterObject,
      )
      registerNamed(name, paramOrRef, context)
    }
  }

  if (!isNil(headers)) {
    for (const [name, headerOrRef] of entries(headers)) {
      await resolveReferenceable<HeaderObject>(
        { data: headerOrRef, uri: context.uri.append(uri, 'headers', name) },
        context,
        resolveHeaderObject,
      )
      registerNamed(name, headerOrRef, context)
    }
  }

  if (!isNil(responses)) {
    for (const [name, respOrRef] of entries(responses)) {
      await resolveReferenceable<ResponseObject>(
        { data: respOrRef, uri: context.uri.append(uri, 'responses', name) },
        context,
        resolveResponseObject,
      )
      registerNamed(name, respOrRef, context)
    }
  }

  if (!isNil(requestBodies)) {
    for (const [name, reqOrRef] of entries(requestBodies)) {
      await resolveReferenceable<RequestBodyObject>(
        { data: reqOrRef, uri: context.uri.append(uri, 'requestBodies', name) },
        context,
        resolveRequestBodyObject,
      )
      registerNamed(name, reqOrRef, context)
    }
  }
}
