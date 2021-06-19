import { identifier, tsStringKeyword, tsTypeParameterInstantiation, tsTypeReference } from '@babel/types'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getDictionaryTypeAst(data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext) {
  const { accessor } = context
  const { additionalProperties } = accessor.dereference(data)
  const schema = typeof additionalProperties === 'boolean' ? null : additionalProperties
  return tsTypeReference(
    identifier('Record'),
    tsTypeParameterInstantiation([tsStringKeyword(), getTypeReferenceAst(schema, context)]),
  )
}
