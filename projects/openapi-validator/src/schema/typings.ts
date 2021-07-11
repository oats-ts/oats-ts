import { SchemaObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export type SchemaValidator = (
  input: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  visited: Set<SchemaObject>,
) => Issue[]
