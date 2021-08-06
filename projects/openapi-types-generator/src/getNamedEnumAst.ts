import { factory, SyntaxKind, EnumDeclaration } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { safeName } from '@oats-ts/typescript-common'

export function getNamedEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): EnumDeclaration {
  const { nameOf } = context
  return factory.createEnumDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(input, 'openapi/type')),
    input.enum.map((value) => {
      return factory.createEnumMember(safeName(value.toString()), getLiteralAst(value))
    }),
  )
}
