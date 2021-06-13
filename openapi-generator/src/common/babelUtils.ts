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
} from '@babel/types'
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
