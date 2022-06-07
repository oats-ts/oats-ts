import { SchemaObject } from '@oats-ts/json-schema-model'
import { register } from './register'
import { resolveDiscriminatorObject } from './resolveDiscriminatorObject'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { schemaObject } from './validators/schemaObject'
import { entries, isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

export function resolveSchemaObject(input: ReadInput<SchemaObject>, context: ReadContext): Try<SchemaObject> {
  const validationResult = validate(input, context, schemaObject)
  if (isFailure(validationResult)) {
    return validationResult
  }

  register(input, context)

  const { data, uri } = input
  const { items, not, allOf, oneOf, anyOf, properties, additionalProperties, discriminator, prefixItems } = data ?? {}
  const parts: Try<any>[] = []

  if (!isNil(items) && typeof items !== 'boolean') {
    parts.push(
      context.ref.resolveReferenceable(
        { data: items, uri: context.uri.append(uri, 'items') },
        context,
        resolveSchemaObject,
      ),
    )
  }

  if (!isNil(not)) {
    parts.push(
      context.ref.resolveReferenceable(
        { data: not, uri: context.uri.append(uri, 'not') },
        context,
        resolveSchemaObject,
      ),
    )
  }

  if (!isNil(discriminator)) {
    parts.push(
      resolveDiscriminatorObject({ data: discriminator, uri: context.uri.append(uri, 'discriminator') }, context),
    )
  }

  if (!isNil(additionalProperties) && typeof additionalProperties !== 'boolean') {
    parts.push(
      context.ref.resolveReferenceable(
        { data: additionalProperties, uri: context.uri.append(uri, 'additionalProperties') },
        context,
        resolveSchemaObject,
      ),
    )
  }

  if (!isNil(allOf)) {
    const allOfUri = context.uri.append(uri, 'allOf')
    register({ data: allOf, uri: allOfUri }, context)
    for (let i = 0; i < allOf.length; i += 1) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: allOf[i], uri: context.uri.append(allOfUri, i.toString()) },
          context,
          resolveSchemaObject,
        ),
      )
    }
  }

  if (!isNil(oneOf)) {
    const oneOfUri = context.uri.append(uri, 'oneOf')
    register({ data: oneOf, uri: oneOfUri }, context)
    for (let i = 0; i < oneOf.length; i += 1) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: oneOf[i], uri: context.uri.append(oneOfUri, i.toString()) },
          context,
          resolveSchemaObject,
        ),
      )
    }
  }

  if (!isNil(anyOf)) {
    const anyOfUri = context.uri.append(uri, 'anyOf')
    register({ data: anyOf, uri: anyOfUri }, context)
    for (let i = 0; i < anyOf.length; i += 1) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: anyOf[i], uri: context.uri.append(anyOfUri, i.toString()) },
          context,
          resolveSchemaObject,
        ),
      )
    }
  }

  if (!isNil(properties)) {
    const propertiesUri = context.uri.append(uri, 'properties')
    register({ data: properties, uri: propertiesUri }, context)
    for (const [name, propSchema] of entries(properties)) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: propSchema, uri: context.uri.append(propertiesUri, name) },
          context,
          resolveSchemaObject,
        ),
      )
    }
  }

  if (!isNil(prefixItems)) {
    const prefixItemsUri = context.uri.append(uri, 'prefixItems')
    for (let i = 0; i < prefixItems.length; i += 1) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: prefixItems[i], uri: context.uri.append(prefixItemsUri, i.toString()) },
          context,
          resolveSchemaObject,
        ),
      )
    }
  }

  const merged = fromArray(parts)
  return isSuccess(merged) ? success(data) : merged
}
