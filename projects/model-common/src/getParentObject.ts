import { URIManipulatorType } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import { ReadOutput } from './types'

export function getParentObject(input: any, uriManipulator: URIManipulatorType, data: ReadOutput<any>): any {
  const uri = data.objectToUri.get(input)
  if (isNil(uri)) {
    return undefined
  }
  const fragments = uriManipulator.fragments(uri)
  if (fragments.length === 0) {
    return undefined
  }
  const parentUri = uriManipulator.setFragments(uri, fragments.slice(0, -1))
  return data.uriToObject.get(parentUri)
}
