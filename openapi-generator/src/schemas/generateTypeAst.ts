import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { findDiscriminatorFields } from '../findDiscriminatorFields'
import entries from 'lodash/entries'
import isNil from 'lodash/isNil'
import has from 'lodash/has'

import {
  tsTypeAliasDeclaration,
  identifier,
  tsTypeLiteral,
  tsPropertySignature,
  tsTypeAnnotation,
  tsStringKeyword,
  tsNumberKeyword,
  tsTypeReference,
  tsEnumDeclaration,
  tsEnumMember,
  stringLiteral,
  tsUnionType,
  numericLiteral,
  booleanLiteral,
  exportNamedDeclaration,
  tsAnyKeyword,
  TSPropertySignature,
  tsLiteralType,
  tsTypeParameterInstantiation,
  tsArrayType,
  tsBooleanKeyword,
  tsUndefinedKeyword,
  Statement,
  TSUnionType,
  TSTypeLiteral,
  TSType,
} from '@babel/types'
import { OpenAPIGeneratorContext } from '../typings'

function generateEnumValueAst(value: string | number | boolean) {
  if (typeof value === 'string') {
    return stringLiteral(value)
  } else if (typeof value === 'number') {
    return numericLiteral(value)
  } else if (typeof value === 'boolean') {
    return booleanLiteral(value)
  }
}

export function generateEnumAst(input: SchemaObject, context: OpenAPIGeneratorContext): Statement {
  const { accessor } = context
  return exportNamedDeclaration(
    tsEnumDeclaration(
      identifier(accessor.name(input, 'schema')),
      input.enum.map((value) => {
        return tsEnumMember(identifier(value.toString()), generateEnumValueAst(value))
      }),
    ),
  )
}

export function generateTypeReferenceAst(data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext) {
  const { accessor } = context
  const schema = isNil(data) ? null : accessor.dereference(data)
  if (isNil(schema)) {
    return tsAnyKeyword()
  }
  const name = accessor.name(schema, 'schema')
  if (isNil(name)) {
    return generateRighthandSideAst(schema, context)
  }
  return tsTypeReference(identifier(name))
}

export function generateObjectTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSTypeLiteral {
  const discriminators = findDiscriminatorFields(data, context)

  const discriminatorFields = entries(discriminators || {}).map(([name, value]): TSPropertySignature => {
    return tsPropertySignature(identifier(name), tsTypeAnnotation(tsLiteralType(stringLiteral(value))))
  })

  const fields = entries(data.properties || {})
    .filter(([name]) => !has(discriminators, name))
    .map(([name, schema]): TSPropertySignature => {
      const property = tsPropertySignature(
        identifier(name),
        tsTypeAnnotation(generateTypeReferenceAst(schema, context)),
      )
      property.optional = data?.required?.indexOf(name) >= 0
      return property
    })
  return tsTypeLiteral(discriminatorFields.concat(fields))
}

export function generateUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSUnionType {
  const types = data.oneOf.map((type) => generateTypeReferenceAst(type, context))
  return tsUnionType(types)
}

export function generateDictionaryTypeAst(data: SchemaObject | ReferenceObject, context: OpenAPIGeneratorContext) {
  const { accessor } = context
  const schema = accessor.dereference(data)

  return tsTypeReference(
    identifier('Record'),
    tsTypeParameterInstantiation([
      tsStringKeyword(),
      generateTypeReferenceAst(schema.additionalProperties as any, context),
    ]),
  )
}

export function generateArrayTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext) {
  return tsArrayType(generateTypeReferenceAst(data.items, context))
}

export function generateLiteralUnionTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext) {
  return tsUnionType(data.enum.map((value) => tsLiteralType(generateEnumValueAst(value.value))))
}

export function generateRighthandSideAst(data: SchemaObject, context: OpenAPIGeneratorContext): TSType {
  if (!isNil(data.oneOf)) {
    return generateUnionTypeAst(data, context)
  }

  if (!isNil(data.enum)) {
    return generateLiteralUnionTypeAst(data, context)
  }

  switch (data.type) {
    case 'string':
      return tsStringKeyword()
    case 'number':
    case 'integer':
      return tsNumberKeyword()
    case 'boolean':
      return tsBooleanKeyword()
    case 'object':
      if (!isNil(data.additionalProperties)) {
        return generateDictionaryTypeAst(data, context)
      }
      return generateObjectTypeAst(data, context)
    case 'array':
      return generateArrayTypeAst(data, context)
    case 'null':
      return tsUndefinedKeyword()
    default:
      return tsAnyKeyword()
  }
}

export function generateTypeAst(data: SchemaObject, context: OpenAPIGeneratorContext): Statement {
  const { accessor } = context
  if (!isNil(data.enum)) {
    return generateEnumAst(data, context)
  }

  return exportNamedDeclaration(
    tsTypeAliasDeclaration(
      identifier(accessor.name(data, 'schema')),
      undefined,
      generateRighthandSideAst(data, context),
    ),
  )
}
