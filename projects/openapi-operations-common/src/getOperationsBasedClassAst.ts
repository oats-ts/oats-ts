import { EnhancedOperation } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import {
  factory,
  SyntaxKind,
  ParameterDeclaration,
  TypeNode,
  ClassDeclaration,
  ExpressionWithTypeArguments,
  ClassElement,
} from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export function getOperationsBasedClassAst(
  name: string,
  documentation: boolean,
  operations: EnhancedOperation[],
  superType: ExpressionWithTypeArguments,
  classElements: ClassElh upement[],
  methodName: (operation: EnhancedOperation) => string,
  parameters: (operation: EnhancedOperation) => ParameterDeclaration[],
  returnType: (operation: EnhancedOperation) => TypeNode,
): ClassDeclaration {
  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    name,
    [],
    [factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [superType])],
    [
      ...classElements,
      ...operations.map((data) => {
        const methodDecl = factory.createMethodDeclaration(
          [],
          [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
          undefined,
          nameOf(data.operation, 'openapi/operation'),
          undefined,
          [],
          parameters(data),
          factory.createTypeReferenceNode('Promise', [
            factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/response-type')),
          ]),
          factory.createBlock([returnStatement]),
        )

        return documentation ? documentNode(methodDecl, data.operation) : methodDecl
      }),
    ],
  )
}
