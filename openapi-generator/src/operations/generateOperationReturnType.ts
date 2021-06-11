import {
  exportNamedDeclaration,
  identifier,
  ImportDeclaration,
  TSType,
  tsTypeAliasDeclaration,
  tsTypeReference,
  tsVoidKeyword,
} from '@babel/types'
import { OperationObject, ReferenceObject, SchemaObject, ResponseObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../typings'
import { generateRighthandSideAst, generateTypeReferenceAst } from '../schemas/generateTypeAst'
import { BabelModule } from '../../../babel-writer/lib'
import { isNil, values } from 'lodash'
import { collectReferencedNamedSchemas } from '../schemas/collectReferencedNamedSchemas'
import { createImportDeclarations } from '../createImportDeclarations'

function collectReturnSchemas(operation: OperationObject, context: OpenAPIGeneratorContext): SchemaObject[] {
  const { accessor } = context
  const schemas: SchemaObject[] = []
  for (const resOrRef of values(operation.responses || {}) as (ResponseObject | ReferenceObject)[]) {
    const repsonse = accessor.dereference(resOrRef)
    for (const mediaTypeObj of values(repsonse.content || {})) {
      if (!isNil(mediaTypeObj.schema)) {
        schemas.push(accessor.dereference(mediaTypeObj.schema))
      }
    }
  }
  return schemas
}

function needsOperationReturnType(schemas: SchemaObject[], context: OpenAPIGeneratorContext): boolean {
  const { accessor } = context
  if (schemas.length === 0) {
    return false
  }
  if (schemas.length === 1) {
    const [schema] = schemas
    // No need to generate type for primitive
    if (
      schema.type === 'string' ||
      schema.type === 'number' ||
      schema.type === 'integer' ||
      schema.type === 'boolean'
    ) {
      return false
    }
    if (!isNil(accessor.name(schema, 'type'))) {
      return false
    }
  }
  return true
}

export function getOperationReturnTypeReference(operation: OperationObject, context: OpenAPIGeneratorContext): TSType {
  const { accessor } = context
  const schemas = collectReturnSchemas(operation, context)
  if (!needsOperationReturnType(schemas, context)) {
    switch (schemas.length) {
      case 0:
        return tsVoidKeyword()
      case 1:
        return generateTypeReferenceAst(schemas[0], context)
    }
  }
  return tsTypeReference(identifier(accessor.name(operation, 'operation-return-type')))
}

export function getOperationReturnTypeImports(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const schemas = collectReturnSchemas(operation, context)
  const wrapperSchema: SchemaObject = {
    oneOf: schemas,
  }
  const path = accessor.path(operation, 'operation-return-type')
  const referencedSchemas = collectReferencedNamedSchemas(wrapperSchema, context)
  return createImportDeclarations(path, 'type', referencedSchemas, context)
}

export function generateOperationReturnType(operation: OperationObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const schemas = collectReturnSchemas(operation, context)
  if (!needsOperationReturnType(schemas, context)) {
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
          generateRighthandSideAst(wrapperSchema, context),
        ),
      ),
    ],
  }
}
