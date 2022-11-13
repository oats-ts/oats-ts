import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { Issue } from '@oats-ts/validators'
import { ifNotValidated } from '../utils/ifNotValidated'
import { ordered } from '../utils/ordered'
import { validatorConfig } from '../utils/validatorConfig'
import { isNil } from 'lodash'
import { structural } from '../structural'

function traverseReferences(
  input: ReferenceObject,
  context: OpenAPIValidatorContext,
  visited: Set<ReferenceObject>,
): Set<ReferenceObject> | undefined {
  if (visited.has(input)) {
    return visited
  }
  visited.add(input)
  const target = context.dereference(input)
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
  )(() =>
    ordered(() => structural.referenceObject(input, context.uriOf(input), validatorConfig))(() =>
      ordered((): Issue[] => {
        if (isNil(context.dereference(input))) {
          return [
            {
              message: `${input.$ref} is an invalid reference`,
              path: context.uriOf(input),
              severity: 'error',
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
            path: context.uriOf(input),
            severity: 'error',
          },
        ]
      }),
    ),
  )
}
