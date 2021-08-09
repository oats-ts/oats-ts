import { ParameterObject } from '@oats-ts/asyncapi-model'
import { register } from './register'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { parameterObject } from './validators/parameterObject'
import { isNil } from 'lodash'

export async function resolveParameterObject(input: ReadInput<ParameterObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, parameterObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { schema } = data

  if (!isNil(schema)) {
    await resolveReferenceable({ data: schema, uri: context.uri.append(uri, 'schema') }, context, resolveSchemaObject)
  }
}
