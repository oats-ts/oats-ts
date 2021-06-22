import { entries, has, keys, sortBy } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, PropertySignature, SyntaxKind } from 'typescript'
import { getDiscriminators } from '../common/getDiscriminators'
import { tsIdAst } from '../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getTypeReferenceAst } from './getTypeReferenceAst'

/** To generate resonable types when the allOf[ref, {description}] format is used, to deal with OpenAPIs BS */
function getSchema(schema: SchemaObject | ReferenceObject): SchemaObject | ReferenceObject {
  if (
    !isReferenceObject(schema) &&
    schema.allOf &&
    schema.allOf.length === 2 &&
    schema.allOf.some(isReferenceObject) &&
    schema.allOf.some((s) => !isReferenceObject(s) && keys(s).length === 1 && has(s, 'description'))
  ) {
    return schema.allOf.find(isReferenceObject)
  }
  return schema
}

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
        getTypeReferenceAst(getSchema(schema), context),
      )
    })

  return discriminatorProperties.concat(properties)
}
