import { ComponentsObject, HeaderObject, ParameterObject, ResponseObject, SchemaObject } from 'openapi3-ts'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { componentsObject } from './validators/componentsObject'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'
import { resolveHeaderObject, resolveParameterObject } from './resolveParameterObject'
import { register } from './register'
import { resolveResponseObject } from './resolveResponseObject'
import { entries, isNil } from 'lodash'

export async function resolveComponents(input: ReadInput<ComponentsObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, componentsObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { callbacks, headers, links, examples, parameters, requestBodies, responses, schemas, securitySchemes } = data

  if (!isNil(schemas)) {
    for (const [name, schemaOrRef] of entries(schemas)) {
      await resolveReferenceable<SchemaObject>(
        { data: schemaOrRef, uri: context.uri.append(uri, 'schemas', name) },
        context,
        resolveSchemaObject,
      )
    }
  }

  if (!isNil(parameters)) {
    for (const [name, paramOrRef] of entries(parameters)) {
      await resolveReferenceable<ParameterObject>(
        { data: paramOrRef, uri: context.uri.append(uri, 'parameters', name) },
        context,
        resolveParameterObject,
      )
    }
  }

  if (!isNil(headers)) {
    for (const [name, headerOrRef] of entries(headers)) {
      await resolveReferenceable<HeaderObject>(
        { data: headerOrRef, uri: context.uri.append(uri, 'headers', name) },
        context,
        resolveHeaderObject,
      )
    }
  }

  if (!isNil(responses)) {
    for (const [name, respOrRef] of entries(responses)) {
      await resolveReferenceable<ResponseObject>(
        { data: respOrRef, uri: context.uri.append(uri, 'responses', name) },
        context,
        resolveResponseObject,
      )
    }
  }

  if (!isNil(callbacks)) {
  }
  if (!isNil(links)) {
  }
  if (!isNil(examples)) {
  }
  if (!isNil(requestBodies)) {
  }
  if (!isNil(securitySchemes)) {
  }
}
