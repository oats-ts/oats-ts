import { ComponentsObject, ParameterObject } from '@oats-ts/asyncapi-model'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { componentsObject } from './validators/componentsObject'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'
import { resolveParameterObject } from './resolveParameterObject'
import { register } from './register'
import { entries, isNil } from 'lodash'
import { registerNamed } from './registerNamed'

export async function resolveComponents(input: ReadInput<ComponentsObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, componentsObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { parameters, schemas } = data

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
}
