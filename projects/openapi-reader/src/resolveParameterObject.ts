import type { Validator } from '@oats-ts/validators'
import { BaseParameterObject, HeaderObject, ParameterObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { resolveMediaTypeObject } from './resolveMediaTypeObject'
import { resolveSchemaObject } from './resolveSchemaObject'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { headerObject, parameterObject } from './validators/parameterObject'
import { entries, isNil } from 'lodash'
import { fromArray, isFailure, isSuccess, success, Try } from '@oats-ts/try'

const resolveBaseParameter =
  <T extends BaseParameterObject>(validator: Validator<any>) =>
  (input: ReadInput<T>, context: ReadContext): Try<T> => {
    const validationResult = validate(input, context, validator)
    if (isFailure(validationResult)) {
      return validationResult
    }

    register(input, context)

    const { data, uri } = input
    const { content, schema } = data ?? {}
    const parts: Try<any>[] = []

    if (!isNil(schema)) {
      parts.push(
        context.ref.resolveReferenceable(
          { data: schema, uri: context.uri.append(uri, 'schema') },
          context,
          resolveSchemaObject,
        ),
      )
    }

    if (!isNil(content)) {
      for (const [key, mediaTypeObject] of entries(content)) {
        parts.push(
          resolveMediaTypeObject({ data: mediaTypeObject, uri: context.uri.append(uri, 'content', key) }, context),
        )
      }
    }

    const merged = fromArray(parts)
    return isSuccess(merged) ? success(data) : merged
  }

export const resolveHeaderObject = resolveBaseParameter<HeaderObject>(headerObject)

export const resolveParameterObject = resolveBaseParameter<ParameterObject>(parameterObject)
