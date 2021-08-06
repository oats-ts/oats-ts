import { entries, has, sortBy } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, PropertySignature } from 'typescript'
import { getDiscriminators } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getObjectPropertyAst } from './getObjectPropertyAst'
import { TypesGeneratorConfig } from './typings'
import { safeName } from '@oats-ts/typescript-common'

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
        safeName(name),
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
