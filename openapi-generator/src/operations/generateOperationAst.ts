import {
  blockStatement,
  functionDeclaration,
  identifier,
  Statement,
  tsAnyKeyword,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { OperationObject, PathItemObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import type { HttpMethod } from '@oats-ts/http'


export function generateOperationAst(
  url: string,
  method: HttpMethod,
  data: OperationObject,
  context: OpenAPIGeneratorContext,
): Statement {
  const fn = functionDeclaration(
    identifier(data.operationId),
    [
      /* params */
    ],
    blockStatement([]),
    false,
    true,
  )
  fn.returnType = tsTypeAnnotation(
    tsTypeReference(identifier('Promise'), tsTypeParameterInstantiation([tsAnyKeyword()])),
  )
  return fn
}
