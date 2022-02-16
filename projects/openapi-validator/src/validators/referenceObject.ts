import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { Issue, object, shape, string } from '@oats-ts/validators'
import { ifNotValidated } from '../utils/ifNotValidated'
import { ordered } from '../utils/ordered'
import { append } from '../utils/append'
import { isNil } from 'lodash'

const validator = object(shape<ReferenceObject>({ $ref: string() }, true))

function traverseReferences(
  input: ReferenceObject,
  context: OpenAPIValidatorContext,
  visited: Set<ReferenceObject>,
): Set<ReferenceObject> {
  if (visited.has(input)) {
    return visited
  }
  visited.add(input)
  const { dereference } = context
  const target = dereference(input)
  if (isNil(target)) {
    return undefined
  }
  if (isReferenceObject(target)) {
    return traverseReferences(target, context, visited)
  }
  return undefined
}

export function referenceObject(
  input: ReferenceObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    input,
  )(() => {
    const { uriOf, dereference } = context
    return ordered(() => validator(input, { append, path: uriOf(input) }))(() =>
      ordered((): Issue[] => {
        if (isNil(dereference(input))) {
          return [
            {
              message: `${input.$ref} is an invalid reference`,
              path: uriOf(input),
              severity: 'error',
              type: 'other',
            },
          ]
        }
        return []
      })(() => {
        const depCycle = traverseReferences(input, context, new Set())
        if (isNil(depCycle)) {
          return []
        }
        return [
          {
            message: `circular $ref detected`,
            path: uriOf(input),
            severity: 'error',
            type: 'other',
          },
        ]
      }),
    )
  })
}
