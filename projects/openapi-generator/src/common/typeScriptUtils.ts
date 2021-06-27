import { head } from 'lodash'
import {
  Expression,
  BinaryExpression,
  factory,
  Identifier,
  ImportDeclaration,
  StringLiteral,
  BinaryOperator,
  PropertyAccessExpression,
  ElementAccessExpression,
} from 'typescript'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { createImportPath } from './createImportPath'
import { isIdentifier } from './isIdentifier'

export function tsIdAst(input: string): Identifier | StringLiteral {
  return isIdentifier(input) ? factory.createIdentifier(input) : factory.createStringLiteral(input)
}

export function tsImportAst(from: string, names: string[]): ImportDeclaration {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(
        names.map((name) => factory.createImportSpecifier(undefined, factory.createIdentifier(name))),
      ),
    ),
    factory.createStringLiteral(from),
  )
}

export function tsRelativeImports(fromPath: string, to: [string, string][]): ImportDeclaration[] {
  return to
    .filter(([toPath]) => toPath !== fromPath)
    .map(([toPath, name]) => tsImportAst(createImportPath(fromPath, toPath), [name]))
}

export function tsModelImportAsts(
  fromPath: string,
  target: OpenAPIGeneratorTarget,
  referencedModel: any[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  return tsRelativeImports(
    fromPath,
    referencedModel.map((model): [string, string] => [accessor.path(model, target), accessor.name(model, target)]),
  )
}

export function tsBinaryExpressions(
  operator: BinaryOperator,
  expressions: Expression[],
): Expression | BinaryExpression {
  switch (expressions.length) {
    case 0:
      throw new TypeError(`Cannot create BinaryExpression from 0 elements`)
    case 1:
      return head(expressions)
    default: {
      const [h, ...t] = expressions
      return factory.createBinaryExpression(h, operator, tsBinaryExpressions(operator, t))
    }
  }
}

export function tsMemberAccess(
  expression: Expression,
  member: string,
): PropertyAccessExpression | ElementAccessExpression {
  return isIdentifier(member)
    ? factory.createPropertyAccessExpression(expression, member)
    : factory.createElementAccessExpression(expression, factory.createStringLiteral(member))
}
