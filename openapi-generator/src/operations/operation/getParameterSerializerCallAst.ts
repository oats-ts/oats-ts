import { CallExpression, callExpression, identifier, memberExpression } from '@babel/types'

export function getParameterSerializerCallAst(fnName: string, inputKey: string): CallExpression {
  return callExpression(identifier(fnName), [memberExpression(identifier('input'), identifier(inputKey))])
}
