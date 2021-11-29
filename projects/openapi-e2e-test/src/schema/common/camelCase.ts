import _camelCase from 'camelcase'
import { isNil } from 'lodash'

export function camelCase(...inputs: string[]): string {
  return _camelCase(inputs.filter((e) => !isNil(e) && e.length > 0).join('-'))
}
