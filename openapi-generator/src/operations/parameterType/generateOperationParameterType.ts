import {
  exportNamedDeclaration,
  identifier,
  ImportDeclaration,
  tsTypeAliasDeclaration,
  TSType,
  tsTypeReference,
} from '@babel/types'
import { OperationObject, ParameterLocation, ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { getReferencedNamedSchemas } from '../../common/getReferencedNamedSchemas'
import { createImportDeclarations } from '../../common/getImportDeclarations'
import { getRighthandSideTypeAst } from '../../schemas/types/getRighthandSideTypeAst'

function asSchemaObject(params: ParameterObject[]): SchemaObject {
  return {
    type: 'object',
    required: params.filter((param) => param.required).map((param) => param.name),
    properties: params.reduce(
      (props: Record<string, SchemaObject | ReferenceObject>, param: ParameterObject) =>
        Object.assign(props, {
          [param.name]: param.schema,
        }),
      {},
    ),
  }
}

export function generateParameterTypeReference(
  parameters: ParameterObject[],
  operation: OperationObject,
  target: OpenAPIGeneratorTarget,
  location: ParameterLocation,
  context: OpenAPIGeneratorContext,
): TSType {
  const { accessor } = context
  const params = parameters.filter((param) => param.in === location)
  if (params.length === 0) {
    return undefined
  }
  return tsTypeReference(identifier(accessor.name(operation, target)))
}

export function getParameterTypeImports(
  parameters: ParameterObject[],
  operation: OperationObject,
  target: OpenAPIGeneratorTarget,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const paramsSchema = asSchemaObject(parameters)
  const path = accessor.path(operation, target)
  const referencedSchemas = getReferencedNamedSchemas(paramsSchema, context)
  return createImportDeclarations(path, 'type', referencedSchemas, context)
}

export function generateParameterType(
  parameters: ParameterObject[],
  operation: OperationObject,
  target: OpenAPIGeneratorTarget,
  context: OpenAPIGeneratorContext,
): BabelModule {
  if (parameters.length === 0) {
    return undefined
  }
  const { accessor } = context
  return {
    imports: getParameterTypeImports(parameters, operation, target, context),
    path: accessor.path(operation, target),
    statements: [
      exportNamedDeclaration(
        tsTypeAliasDeclaration(
          identifier(accessor.name(operation, target)),
          undefined,
          getRighthandSideTypeAst(asSchemaObject(parameters), context),
        ),
      ),
    ],
  }
}
