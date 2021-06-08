import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { entries, hasOwnProperty, isNil } from '../../../utils'
import { findDiscriminatorFields } from '../findDiscriminatorFields'
import { GeneratorInput } from '../typings'
import { SchemaContext } from './types'

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
} from '@babel/types'

function generateEnumValueAst(value: string | number | boolean) {
  if (typeof value === 'string') {
    return stringLiteral(value)
  } else if (typeof value === 'number') {
    return numericLiteral(value)
  } else if (typeof value === 'boolean') {
    return booleanLiteral(value)
  }
}

export function generateEnumAst(input: GeneratorInput<SchemaObject>, context: SchemaContext) {
  const { data } = input

  return exportNamedDeclaration(
    tsEnumDeclaration(
      identifier(context.utils.nameOf(data)),
      data.enum.map((value) => {
        return tsEnumMember(identifier(value.toString()), generateEnumValueAst(value))
      }),
    ),
  )
}

export function generateTypeReferenceAst(
  input: GeneratorInput<SchemaObject | ReferenceObject>,
  context: SchemaContext,
) {
  const { data } = input
  const schema = isNil(data) ? null : context.utils.dereference(data)
  if (isNil(schema)) {
    return tsTypeAnnotation(tsAnyKeyword())
  }
  const name = context.utils.nameOf(schema)
  if (isNil(name)) {
    return generateRighthandSideAst({ data: schema, uri: 'TODO' }, context)
  }
  return tsTypeReference(identifier(name))
}

export function generateObjectTypeAst(input: GeneratorInput<SchemaObject>, context: SchemaContext): TSTypeLiteral {
  const { data } = input
  const discriminators = findDiscriminatorFields(data, context)

  const discriminatorFields = entries(discriminators || {}).map(([name, value]): TSPropertySignature => {
    return tsPropertySignature(identifier(name), tsTypeAnnotation(tsLiteralType(stringLiteral(value))))
  })

  const fields = entries(data.properties || {})
    .filter(([name]) => !hasOwnProperty(discriminators, name))
    .map(([name, schema]): TSPropertySignature => {
      const property = tsPropertySignature(
        identifier(name),
        tsTypeAnnotation(generateTypeReferenceAst({ data: schema, uri: 'TODO' }, context)),
      )
      property.optional = data?.required?.indexOf(name) >= 0
      return property
    })
  return tsTypeLiteral(discriminatorFields.concat(fields))
}

export function generateUnionTypeAst(input: GeneratorInput<SchemaObject>, context: SchemaContext): TSUnionType {
  const { data } = input
  const types = data.oneOf.map((type) => generateTypeReferenceAst({ data: type, uri: 'TODO' }, context))
  return tsUnionType(types)
}

export function generateDictionaryTypeAst(
  input: GeneratorInput<SchemaObject | ReferenceObject>,
  context: SchemaContext,
) {
  const { data } = input
  const schema = context.utils.dereference(data)

  return tsTypeReference(
    identifier('Record'),
    tsTypeParameterInstantiation([
      tsStringKeyword(),
      generateTypeReferenceAst({ data: schema.additionalProperties as any, uri: 'TODO' }, context),
    ]),
  )
}

export function generateArrayTypeAst(input: GeneratorInput<SchemaObject>, context: SchemaContext) {
  const { data } = input
  return tsArrayType(generateTypeReferenceAst({ data: data.items, uri: 'TODO' }, context))
}

export function generateLiteralUnionTypeAst(input: GeneratorInput<SchemaObject>, context: SchemaContext) {
  const { data } = input
  return tsUnionType(data.enum.map((value) => tsLiteralType(generateEnumValueAst(value.value))))
}

export function generateRighthandSideAst(input: GeneratorInput<SchemaObject>, context: SchemaContext) {
  const { data } = input
  if (!isNil(data.oneOf)) {
    return generateUnionTypeAst(input, context)
  }

  if (!isNil(data.enum)) {
    return generateLiteralUnionTypeAst(input, context)
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
        return generateDictionaryTypeAst(input, context)
      }
      return generateObjectTypeAst(input, context)
    case 'array':
      return generateArrayTypeAst(input, context)
    case 'null':
      return tsUndefinedKeyword()
    default:
      return tsAnyKeyword()
  }
}

export function generateTypeAst(input: GeneratorInput<SchemaObject>, context: SchemaContext): Statement {
  const { data } = input
  if (!isNil(data.enum)) {
    return generateEnumAst(input, context)
  }

  return exportNamedDeclaration(
    tsTypeAliasDeclaration(identifier(context.utils.nameOf(data)), undefined, generateRighthandSideAst(input, context)),
  )
}
