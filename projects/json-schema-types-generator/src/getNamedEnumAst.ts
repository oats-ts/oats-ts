import { factory, SyntaxKind, EnumDeclaration } from 'typescript'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { getLiteralAst, safeName } from '@oats-ts/typescript-common'
import { TypesGeneratorContext } from './typings'

export function getNamedEnumAst(input: SchemaObject, context: TypesGeneratorContext): EnumDeclaration {
  const { nameOf, target } = context
  return factory.createEnumDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(input, target)),
    input.enum.map((value) => {
      return factory.createEnumMember(safeName(value.toString()), getLiteralAst(value))
    }),
  )
}
