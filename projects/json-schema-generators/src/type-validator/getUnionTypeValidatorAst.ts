import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { getInferredType, RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { safeName } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

function getSchemaKey(data: Referenceable<SchemaObject>, index: number, context: JsonSchemaGeneratorContext): string {
  const type = getInferredType(data)
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return type
    case 'ref':
      return context.nameOf(context.dereference(data), 'oats/type')
    default:
      return `${type}${index}`
  }
}

export function getUnionTypeValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): CallExpression | Identifier {
  const properties = (data.oneOf || []).map((item, index) =>
    factory.createPropertyAssignment(
      safeName(getSchemaKey(item, index, context)),
      getRightHandSideValidatorAst(item, context, config, helper),
    ),
  )
  const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.union), [], [parameters])
}
