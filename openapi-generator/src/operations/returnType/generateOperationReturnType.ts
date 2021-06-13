import {
  exportNamedDeclaration,
  identifier,
  ImportDeclaration,
  TSType,
  tsTypeAliasDeclaration,
  tsTypeReference,
  tsVoidKeyword,
} from '@babel/types'
import { OperationObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { getRighthandSideTypeAst } from '../../schemas/types/getRighthandSideTypeAst'
import { isReturnTypeRequired } from './isReturnTypeRequired'
import { getResponseSchemas } from './getResponseSchemas'
import { getOperationReturnTypeImports } from './getOperationReturnTypeImports'

export function generateOperationReturnType(operation: OperationObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const schemas = getResponseSchemas(operation, context)
  if (!isReturnTypeRequired(schemas, context)) {
    return undefined
  }

  const wrapperSchema: SchemaObject = {
    oneOf: schemas,
  }

  return {
    imports: getOperationReturnTypeImports(operation, context),
    path: accessor.path(operation, 'operation-return-type'),
    statements: [
      exportNamedDeclaration(
        tsTypeAliasDeclaration(
          identifier(accessor.name(operation, 'operation-return-type')),
          undefined,
          getRighthandSideTypeAst(wrapperSchema, context),
        ),
      ),
    ],
  }
}
