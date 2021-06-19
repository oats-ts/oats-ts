import { exportNamedDeclaration, identifier, variableDeclaration, variableDeclarator } from '@babel/types'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export function getValidatorAst(schema: SchemaObject, context: OpenAPIGeneratorContext, references: boolean) {
  const { accessor } = context
  return exportNamedDeclaration(
    variableDeclaration('const', [
      variableDeclarator(
        identifier(accessor.name(schema, 'validator')),
        getRightHandSideValidatorAst(schema, context, references),
      ),
    ]),
  )
}
