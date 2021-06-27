import { factory, SyntaxKind, EnumDeclaration } from 'typescript'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLiteralAst } from './getLiteralAst'
import { safeName } from '@oats-ts/typescript-common'

export function getNamedEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): EnumDeclaration {
  const { accessor } = context
  return factory.createEnumDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(accessor.name(input, 'type')),
    input.enum.map((value) => {
      return factory.createEnumMember(safeName(value.toString()), getLiteralAst(value))
    }),
  )
}
