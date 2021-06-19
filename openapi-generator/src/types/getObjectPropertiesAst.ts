import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { idAst } from '../common/babelUtils'
import { getDiscriminators } from '../common/getDiscriminators'
import { tsIdAst } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export function getObjectPropertiesAst(data: SchemaObject, context: OpenAPIGeneratorContext): PropertySignature[] {
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
    .map(([name, schema]): PropertySignature => {
      const isOptional = (data.required || []).indexOf(name) < 0
      return factory.createPropertySignature(
        undefined,
        tsIdAst(name),
        isOptional ? factory.createToken(SyntaxKind.QuestionToken) : undefined,
        getTypeReferenceAst(schema, context),
      )
    })

  return discriminatorProperties.concat(properties)
}
