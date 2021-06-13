import { stringLiteral, tsLiteralType, tsPropertySignature, TSPropertySignature, tsTypeAnnotation } from '@babel/types'
import { entries, has } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { nameAst } from '../../babelUtils'
import { findDiscriminatorFields } from '../../findDiscriminatorFields'
import { OpenAPIGeneratorContext } from '../../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getObjectPropertiesAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSPropertySignature[] {
  const discriminators = findDiscriminatorFields(data, context) || {}
  const discriminatorProperties = entries(discriminators).map(
    ([name, value]): TSPropertySignature =>
      tsPropertySignature(nameAst(name), tsTypeAnnotation(tsLiteralType(stringLiteral(value)))),
  )

  const properties = entries(data.properties || {})
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schema]): TSPropertySignature => {
      const property = tsPropertySignature(nameAst(name), tsTypeAnnotation(getTypeReferenceAst(schema, context)))
      property.optional = (data.required || []).indexOf(name) < 0
      return property
    })

  return discriminatorProperties.concat(properties)
}
