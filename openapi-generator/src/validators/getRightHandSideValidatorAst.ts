import {
  arrayExpression,
  arrowFunctionExpression,
  CallExpression,
  callExpression,
  Identifier,
  identifier,
  objectExpression,
  objectProperty,
  stringLiteral,
} from '@babel/types'
import { entries, has, isNil, sortBy, values } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { idAst } from '../common/babelUtils'
import { getDiscriminators } from '../common/getDiscriminators'
import { isIdentifier } from '../common/isIdentifier'
import { Validators } from '../common/OatsPackages'
import { getLiteralAst } from '../types/getLiteralAst'
import { OpenAPIGeneratorContext } from '../typings'

const PrimitiveTypes: SchemaObject['type'][] = ['boolean', 'string', 'number', 'integer']

function getSchemaType(schema: SchemaObject): 'string' | 'number' | 'boolean' {
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number'
    case 'string':
      return 'string'
    case 'boolean':
      return 'boolean'
  }
}

export function getRightHandSideValidatorAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): CallExpression | Identifier {
  const { accessor } = context
  if (isReferenceObject(data)) {
    if (!references) {
      return identifier(Validators.any)
    }
    const resolved = accessor.dereference(data)
    return callExpression(identifier(Validators.lazy), [
      arrowFunctionExpression([], identifier(accessor.name(resolved, 'validator'))),
    ])
  }

  if (!isNil(data.oneOf)) {
    if (isNil(data.discriminator)) {
      return callExpression(identifier(Validators.union), [
        objectExpression(
          data.oneOf.map((schemaOrRef) => {
            const schema = accessor.dereference(schemaOrRef)
            const rightHandSide =
              PrimitiveTypes.indexOf(schema.type) >= 0
                ? getRightHandSideValidatorAst(schema, context, false)
                : identifier('any')
            return objectProperty(identifier(getSchemaType(schema)), rightHandSide)
          }),
        ),
      ])
    } else {
      const discriminators = values(data.discriminator.mapping || {})
      return callExpression(identifier(Validators.union), [
        objectExpression(
          discriminators.map(($ref) => {
            return objectProperty(
              identifier(accessor.name(accessor.dereference($ref), 'type')),
              getRightHandSideValidatorAst({ $ref }, context, references),
            )
          }),
        ),
      ])
    }
    return identifier(Validators.any)
  }

  if (!isNil(data.enum)) {
    return callExpression(identifier(Validators.enumeration), [
      arrayExpression(data.enum.map((value) => getLiteralAst(value))),
    ])
  }

  if (data.type === 'string') {
    return callExpression(identifier(Validators.string), [])
  }

  if (data.type === 'number' || data.type === 'integer') {
    return callExpression(identifier(Validators.number), [])
  }

  if (data.type === 'boolean') {
    return callExpression(identifier(Validators.boolean), [])
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return callExpression(identifier(Validators.object), [
      callExpression(identifier(Validators.record), [
        callExpression(identifier(Validators.string), []),
        getRightHandSideValidatorAst(data.additionalProperties, context, references),
      ]),
    ])
  }

  if (!isNil(data.properties)) {
    const discriminators = getDiscriminators(data, context) || {}
    const discriminatorProperties = sortBy(entries(discriminators), ([name]) => name).map(([name, value]) =>
      objectProperty(
        idAst(name),
        callExpression(identifier(Validators.literal), [stringLiteral(value)]),
        !isIdentifier(name),
      ),
    )

    const properties = sortBy(entries(data.properties || {}), ([name]) => name)
      .filter(([name]) => !has(discriminators, name))
      .map(([name, schema]) => {
        const isOptional = (data.required || []).indexOf(name) < 0
        const expr = getRightHandSideValidatorAst(schema, context, references)
        return objectProperty(
          idAst(name),
          isOptional ? callExpression(identifier(Validators.optional), [expr]) : expr,
          !isIdentifier(name),
        )
      })

    return callExpression(identifier(Validators.object), [
      callExpression(identifier(Validators.shape), [objectExpression([...discriminatorProperties, ...properties])]),
    ])
  }

  if (!isNil(data.items)) {
    return callExpression(identifier(Validators.array), [getRightHandSideValidatorAst(data.items, context, references)])
  }

  return identifier(Validators.any)
}
