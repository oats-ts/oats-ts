import { entries, has, keys, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { getDiscriminators } from '../common/getDiscriminators'
import { getSchemaAndDoc } from '../common/jsDoc'
import { tsIdAst } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getObjectPropertyAst } from './getObjectPropertyAst'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getObjectPropertiesAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypesGeneratorConfig,
): PropertySignature[] {
  const discriminators = getDiscriminators(data, context) || {}

  const discriminatorProperties = sortBy(entries(discriminators), ([name]) => name).map(
    ([name, value]): PropertySignature => {
      return factory.createPropertySignature(
        undefined,
        tsIdAst(name),
        undefined,
        factory.createLiteralTypeNode(factory.createStringLiteral(value)),
      )
    },
  )

  const properties = sortBy(entries(data.properties || {}), ([name]) => name)
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schemaOrRef]): PropertySignature => {
      const isOptional = (data.required || []).indexOf(name) < 0
      return getObjectPropertyAst(name, isOptional, schemaOrRef, context, config)
    })

  return discriminatorProperties.concat(properties)
}
