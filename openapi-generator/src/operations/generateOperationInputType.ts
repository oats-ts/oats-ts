import {
  exportNamedDeclaration,
  identifier,
  ImportDeclaration,
  Statement,
  tsPropertySignature,
  TSPropertySignature,
  TSType,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeLiteral,
  tsTypeReference,
} from '@babel/types'
import { OperationObject, ParameterLocation, ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'
import { generateRighthandSideAst } from '../schemas/generateTypeAst'
import { BabelModule } from '../../../babel-writer/lib'
import { collectReferencedNamedSchemas } from '../schemas/collectReferencedNamedSchemas'
import { createImportDeclarations } from '../createImportDeclarations'
import { PartitionedParameters } from './getPartitionedParameters'

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

export function getParameterTypeImports(
  parameters: ParameterObject[],
  operation: OperationObject,
  target: OpenAPIGeneratorTarget,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const paramsSchema = asSchemaObject(parameters)
  const path = accessor.path(operation, target)
  const referencedSchemas = collectReferencedNamedSchemas(paramsSchema, context)
  return createImportDeclarations(path, 'type', referencedSchemas, context)
}

export function generateOperationInputType(
  parameters: PartitionedParameters,
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context
  const properties: TSPropertySignature[] = []
  if (parameters.header.length > 0) {
    properties.push(
      tsPropertySignature(
        identifier('headers'),
        tsTypeAnnotation(tsTypeReference(identifier(accessor.name(operation, 'operation-headers-type')))),
      ),
    )
  }
  if (parameters.query.length > 0) {
    properties.push(
      tsPropertySignature(
        identifier('query'),
        tsTypeAnnotation(tsTypeReference(identifier(accessor.name(operation, 'operation-query-type')))),
      ),
    )
  }
  if (parameters.path.length > 0) {
    properties.push(
      tsPropertySignature(
        identifier('path'),
        tsTypeAnnotation(tsTypeReference(identifier(accessor.name(operation, 'operation-path-type')))),
      ),
    )
  }

  return {
    imports: [],
    path: accessor.path(operation, 'operation-input-type'),
    statements: [
      exportNamedDeclaration(
        tsTypeAliasDeclaration(
          identifier(accessor.name(operation, 'operation-input-type')),
          undefined,
          tsTypeLiteral(properties),
        ),
      ),
    ],
  }
}
