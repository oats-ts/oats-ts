import { SchemaObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { validateDiscriminatedUnion } from './validateDiscriminatedUnion'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

export function validateUnion(
  input: SchemaObject,
  context: OpenAPIGeneratorContext,
  validated: Set<SchemaObject>,
): Issue[] {
  return isNil(input.discriminator)
    ? validatePrimitiveUnion(input, context, validated)
    : validateDiscriminatedUnion(input, context, validated)
}
