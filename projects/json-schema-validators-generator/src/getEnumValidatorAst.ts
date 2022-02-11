import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getLiteralAst } from '@oats-ts/typescript-common'

export function getEnumValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.enumeration),
    [],
    [factory.createArrayLiteralExpression(data.enum.map((value) => getLiteralAst(value)))],
  )
}