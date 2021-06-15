import {
  identifier,
  Identifier,
  stringLiteral,
  StringLiteral,
  ImportDeclaration,
  importDeclaration,
  importSpecifier,
  tsTypeAnnotation,
  TSType,
  Expression,
  logicalExpression,
} from '@babel/types'
import { head } from 'lodash'
import { isIdentifier } from './isIdentifier'

export function idAst(input: string): Identifier | StringLiteral {
  return isIdentifier(input) ? identifier(input) : stringLiteral(input)
}

export function importAst(from: string, names: string[]): ImportDeclaration {
  return importDeclaration(
    names.map((name) => importSpecifier(identifier(name), identifier(name))),
    stringLiteral(from),
  )
}

export function typedIdAst(name: string, type: TSType): Identifier {
  const parameter = identifier(name)
  parameter.typeAnnotation = tsTypeAnnotation(type)
  return parameter
}

export function logical(operator: '||' | '&&' | '??', expressions: Expression[]): Expression {
  switch (expressions.length) {
    case 0:
      throw new TypeError(`Cannot create LogicalExpression from 0 elements`)
    case 1:
      return head(expressions)
    default: {
      const [h, ...t] = expressions
      return logicalExpression(operator, h, logical(operator, t))
    }
  }
}
