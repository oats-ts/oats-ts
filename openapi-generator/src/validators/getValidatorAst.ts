import { exportNamedDeclaration, identifier, nullLiteral, variableDeclaration, variableDeclarator } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getValidatorAst(schema: SchemaObject, context: OpenAPIGeneratorContext) {
  const { accessor } = context
  return exportNamedDeclaration(
    variableDeclaration('const', [
      variableDeclarator(identifier(accessor.name(schema, 'validator')), getRightHandSideValidatorAst(schema, context)),
    ]),
  )
}
