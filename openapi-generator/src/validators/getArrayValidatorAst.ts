import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { Validators } from '../common/OatsPackages'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  return factory.createCallExpression(
    factory.createIdentifier(Validators.array),
    [],
    config.arrays ? [getRightHandSideValidatorAst(data.items, context, config)] : [],
  )
}
