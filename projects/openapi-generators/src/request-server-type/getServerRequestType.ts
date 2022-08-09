import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'

export function getServerRequestType(data: EnhancedOperation, context: OpenAPIGeneratorContext) {
  const { nameOf, referenceOf } = context
  return factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createIdentifier(nameOf(data.operation, 'oats/request-server-type')),
    undefined,
    factory.createUnionTypeNode([
      factory.createIntersectionTypeNode([
        factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
          referenceOf(data.operation, 'oats/request-type'),
        ]),
        factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.HasIssues), undefined),
      ]),
      factory.createIntersectionTypeNode([
        referenceOf(data.operation, 'oats/request-type'),
        factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Http.HasNoIssues), undefined),
      ]),
    ]),
  )
}
