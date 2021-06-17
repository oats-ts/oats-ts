import {
  ExportNamedDeclaration,
  exportNamedDeclaration,
  identifier,
  classDeclaration,
  classBody,
  classImplements,
  classMethod,
  tsTypeReference,
  blockStatement,
  classProperty,
  tsTypeAnnotation,
  assignmentExpression,
  expressionStatement,
  memberExpression,
} from '@babel/types'
import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../../operations/typings'
import { typedIdAst } from '../../common/babelUtils'
import { getApiClassMethodAst } from './getApiClassMethodAst'

export function getApiClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context

  const configField = classProperty(identifier('config'))
  configField.typeAnnotation = tsTypeAnnotation(tsTypeReference(identifier('RequestConfig')))
  configField.readonly = true
  configField.accessibility = 'private'

  const constructorMethod = classMethod(
    'constructor',
    identifier('constructor'),
    [typedIdAst('config', tsTypeReference(identifier('RequestConfig')))],
    blockStatement([
      expressionStatement(
        assignmentExpression('=', memberExpression(identifier('this'), identifier('config')), identifier('config')),
      ),
    ]),
  )

  const classDecl = classDeclaration(
    identifier(accessor.name(document, 'api-class')),
    undefined,
    classBody([
      configField,
      constructorMethod,
      ...operations.map((operation) => getApiClassMethodAst(operation, context)),
    ]),
    undefined,
  )

  classDecl.implements = [classImplements(identifier(accessor.name(document, 'api-type')))]

  return exportNamedDeclaration(classDecl)
}
