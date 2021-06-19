import {
  BinaryExpression,
  binaryExpression,
  booleanLiteral,
  callExpression,
  Expression,
  identifier,
  memberExpression,
  stringLiteral,
  unaryExpression,
} from '@babel/types'
import { entries, has, isNil, sortBy } from 'lodash'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { idAst, logical } from '../common/babelUtils'
import { getDiscriminators } from '../common/getDiscriminators'
import { isIdentifier } from '../common/isIdentifier'
import { OpenAPIGeneratorContext } from '../typings'
import { getLiteralAst } from '../types/getLiteralAst'

type TypeAssertionConfig = {
  name: Expression
  objectNullCheck: boolean
  checkProperties: boolean
}

function getPropertyAssertionAsts(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: TypeAssertionConfig,
): Expression[] {
  const discriminators = sortBy(entries(getDiscriminators(data, context)), ([name]) => name)
  const properties = sortBy(entries(data.properties), ([name]) => name)

  const discAssertions: Expression[] = discriminators.map(([propName, value]) => {
    const nameAst = isIdentifier(propName)
      ? memberExpression(config.name, identifier(propName))
      : memberExpression(config.name, stringLiteral(propName), true)
    return binaryExpression('===', nameAst, stringLiteral(value))
  })
  const propAssertions: Expression[] = properties
    .filter(([name]) => !has(discriminators, name))
    .map(([name, propSchema]) => {
      const isRequired = (data.required || []).includes(name)
      const nameAst = isIdentifier(name)
        ? memberExpression(config.name, identifier(name))
        : memberExpression(config.name, stringLiteral(name), true)
      return isRequired
        ? getAssertionAst(propSchema, context, { ...config, name: nameAst, objectNullCheck: true })
        : logical('||', [
            binaryExpression('===', nameAst, identifier('null')),
            binaryExpression('===', nameAst, identifier('undefined')),
            getAssertionAst(propSchema, context, { ...config, name: nameAst, objectNullCheck: false }),
          ])
    })

  return discAssertions.concat(propAssertions)
}

function getAssertionAst(
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: TypeAssertionConfig,
): Expression {
  const data = context.accessor.dereference(schema)

  if (Array.isArray(data.oneOf) && data.oneOf.length > 0) {
    return logical(
      '||',
      data.oneOf.map((alt) => getAssertionAst(alt, context, config)),
    )
  }

  if (Array.isArray(data.enum) && data.enum.length > 0) {
    return logical(
      '||',
      data.enum.map((value) => binaryExpression('===', config.name, stringLiteral(value) /*  getLiteralAst(value) */)),
    )
  }

  if (data.type === 'string') {
    return binaryExpression('===', unaryExpression('typeof', config.name), stringLiteral('string'))
  }

  if (data.type === 'number' || data.type === 'integer') {
    return binaryExpression('===', unaryExpression('typeof', config.name), stringLiteral('number'))
  }

  if (data.type === 'boolean') {
    return binaryExpression('===', unaryExpression('typeof', config.name), stringLiteral('boolean'))
  }

  if (!isNil(data.additionalProperties)) {
    const exprs: Expression[] = []
    if (config.objectNullCheck) {
      exprs.push(binaryExpression('!==', config.name, identifier('null')))
    }
    exprs.push(binaryExpression('===', unaryExpression('typeof', config.name), stringLiteral('object')))
    return logical('&&', exprs)
  }

  if (!isNil(data.properties)) {
    const exprs: Expression[] = []
    if (config.objectNullCheck) {
      exprs.push(binaryExpression('!==', config.name, identifier('null')))
    }
    exprs.push(binaryExpression('===', unaryExpression('typeof', config.name), stringLiteral('object')))
    if (config.checkProperties) {
      exprs.push(...getPropertyAssertionAsts(data, context, { ...config, checkProperties: false }))
    }
    return logical('&&', exprs)
  }

  if (!isNil(data.items)) {
    return callExpression(memberExpression(identifier('Array'), identifier('isArray')), [config.name])
  }

  return booleanLiteral(true)
}

export function getShallowTypeAssertionAst(data: SchemaObject, context: OpenAPIGeneratorContext): Expression {
  return getAssertionAst(data, context, {
    checkProperties: true,
    name: identifier('input'),
    objectNullCheck: true,
  })
}
