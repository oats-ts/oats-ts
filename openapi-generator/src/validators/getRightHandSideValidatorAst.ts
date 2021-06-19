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
import { entries, has, isNil, sortBy } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { idAst } from '../common/babelUtils'
import { getDiscriminators } from '../common/getDiscriminators'
import { isIdentifier } from '../common/isIdentifier'
import { Validators } from '../common/OatsPackages'
import { getLiteralAst } from '../types/getLiteralAst'
import { OpenAPIGeneratorContext } from '../typings'

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

  // TODO
  if (!isNil(data.oneOf)) {
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
