import { factory, SyntaxKind, EnumDeclaration } from 'typescript'
import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { getLiteralAst } from './getLiteralAst'
import { tsExportModifier, tsIdAst } from '../common/typeScriptUtils'

export function getNamedEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): EnumDeclaration {
  const { accessor } = context
  return factory.createEnumDeclaration(
    undefined,
    [tsExportModifier()],
    factory.createIdentifier(accessor.name(input, 'type')),
    input.enum.map((value) => {
      return factory.createEnumMember(tsIdAst(value.toString()), getLiteralAst(value))
    }),
  )
}
