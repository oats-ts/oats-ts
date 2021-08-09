import { SchemaObject } from '@oats-ts/json-schema-model'
import { register } from './register'
import { resolveDiscriminatorObject } from './resolveDiscriminatorObject'
import { resolveReferenceable } from './resolveReferenceable'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { schemaObject } from './validators/schemaObject'
import { entries, isNil } from 'lodash'

export async function resolveSchemaObject(input: ReadInput<SchemaObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, schemaObject)) {
    return
  }

  const { data, uri } = input
  const { items, not, allOf, oneOf, anyOf, properties, additionalProperties, discriminator } = data

  register(input, context)

  if (!isNil(items)) {
    await resolveReferenceable({ data: items, uri: context.uri.append(uri, 'items') }, context, resolveSchemaObject)
  }

  if (!isNil(not)) {
    await resolveReferenceable({ data: not, uri: context.uri.append(uri, 'not') }, context, resolveSchemaObject)
  }

  if (!isNil(discriminator)) {
    await resolveDiscriminatorObject({ data: discriminator, uri: context.uri.append(uri, 'discriminator') }, context)
  }

  if (!isNil(additionalProperties) && typeof additionalProperties !== 'boolean') {
    await resolveReferenceable(
      { data: additionalProperties, uri: context.uri.append(uri, 'additionalProperties') },
      context,
      resolveSchemaObject,
    )
  }

  if (!isNil(allOf)) {
    const allOfUri = context.uri.append(uri, 'allOf')
    register({ data: allOf, uri: allOfUri }, context)
    for (let i = 0; i < allOf.length; i += 1) {
      await resolveReferenceable(
        { data: allOf[i], uri: context.uri.append(allOfUri, i.toString()) },
        context,
        resolveSchemaObject,
      )
    }
  }

  if (!isNil(oneOf)) {
    const oneOfUri = context.uri.append(uri, 'oneOf')
    register({ data: oneOf, uri: oneOfUri }, context)
    for (let i = 0; i < oneOf.length; i += 1) {
      await resolveReferenceable(
        { data: oneOf[i], uri: context.uri.append(oneOfUri, i.toString()) },
        context,
        resolveSchemaObject,
      )
    }
  }

  if (!isNil(anyOf)) {
    const anyOfUri = context.uri.append(uri, 'anyOf')
    register({ data: anyOf, uri: anyOfUri }, context)
    for (let i = 0; i < anyOf.length; i += 1) {
      await resolveReferenceable(
        { data: anyOf[i], uri: context.uri.append(anyOfUri, i.toString()) },
        context,
        resolveSchemaObject,
      )
    }
  }

  if (!isNil(properties)) {
    const propertiesUri = context.uri.append(uri, 'properties')
    register({ data: properties, uri: propertiesUri }, context)
    for (const [name, propSchema] of entries(properties)) {
      await resolveReferenceable(
        { data: propSchema, uri: context.uri.append(propertiesUri, name) },
        context,
        resolveSchemaObject,
      )
    }
  }
}
