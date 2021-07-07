import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext, getInferredType } from '@oats-ts/openapi-common'
import { getObjectValidatorAst } from './getObjectValidatorAst'
import { getRecordValidatorAst } from './getRecordValidatorAst'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { getUnionTypeValidatorAst } from './getUnionTypeValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { getArrayValidatorAst } from './getArrayValidatorAst'

export function getRightHandSideValidatorAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  if (isReferenceObject(data)) {
    return getReferenceValidatorAst(data, context, config)
  }
  switch (getInferredType(data)) {
    case 'union':
      return getUnionTypeValidatorAst(data, context, config)
    case 'enum':
      return factory.createCallExpression(
        factory.createIdentifier(RuntimePackages.Validators.enumeration),
        [],
        [factory.createArrayLiteralExpression(data.enum.map((value) => getLiteralAst(value)))],
      )
    case 'string':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], [])
    case 'number':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.number), [], [])
    case 'boolean':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.boolean), [], [])
    case 'record':
      return getRecordValidatorAst(data, context, config)
    case 'object':
      return getObjectValidatorAst(data, context, config)
    case 'array':
      return getArrayValidatorAst(data, context, config)
    default:
      return factory.createIdentifier(RuntimePackages.Validators.any)
  }
}
