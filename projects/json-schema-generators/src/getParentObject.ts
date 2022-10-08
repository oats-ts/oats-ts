import { URIManipulatorType } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import { JsonSchemaGeneratorContext } from './types'

export function getParentObject(
  input: any,
  uriManipulator: URIManipulatorType,
  context: JsonSchemaGeneratorContext,
): any {
  const uri = context.uriOf(input)
  if (isNil(uri)) {
    return undefined
  }
  const fragments = uriManipulator.fragments(uri)
  if (fragments.length === 0) {
    return undefined
  }
  const parentUri = uriManipulator.setFragments(uri, fragments.slice(0, -1))
  return context.uriOf(parentUri)
}
