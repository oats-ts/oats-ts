import {
  arrayExpression,
  CallExpression,
  callExpression,
  Identifier,
  identifier,
  objectExpression,
  objectProperty,
  stringLiteral,
} from '@babel/types'
import { entries, has, isNil, sortBy } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { idAst } from '../common/babelUtils'
import { getDiscriminators } from '../common/getDiscriminators'
import { isIdentifier } from '../common/isIdentifier'
import { Validators } from '../common/OatsPackages'
import { getLiteralAst } from '../types/getLiteralAst'
import { OpenAPIGeneratorContext } from '../typings'

export function getRightHandSideValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
): CallExpression | Identifier {
  if (!isNil(data.oneOf)) {
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
        getRightHandSideValidatorAst(data.additionalProperties, context),
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
        const expr = getRightHandSideValidatorAst(schema, context)
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
    return callExpression(identifier(Validators.array), [getRightHandSideValidatorAst(data.items, context)])
  }

  return identifier(Validators.any)
}
