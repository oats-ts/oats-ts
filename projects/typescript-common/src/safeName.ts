import { isIdentifier } from './isIdentifier'
import { factory, Identifier, StringLiteral } from 'typescript'

export function safeName(input: string): Identifier | StringLiteral {
  return isIdentifier(input) ? factory.createIdentifier(input) : factory.createStringLiteral(input)
}
