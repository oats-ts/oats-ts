import { CallExpression, factory } from 'typescript'

export function getParameterSerializerCallAst(fnName: string, inputKey: string): CallExpression {
  return factory.createCallExpression(
    factory.createIdentifier(fnName),
    [],
    [factory.createPropertyAccessExpression(factory.createIdentifier('input'), inputKey)],
  )
}
