import { Style, Type } from './types'

const types: Type[] = ['primitive', 'array', 'object']

export function unexpectedType(type: any, expectedTypes: Type[] = types): TypeError {
  return new TypeError(
    `Unexpected type "${type}". Expected${expectedTypes.length > 1 ? ' one of' : ''} ${expectedTypes
      .map((type) => `"${type}"`)
      .join(', ')}`,
  )
}

export function unexpectedStyle(style: any, expectedStyles: Style[]): TypeError {
  return new TypeError(
    `Unexpected style "${style}". Expected${expectedStyles.length > 1 ? ' one of' : ''} ${expectedStyles
      .map((type) => `"${type}"`)
      .join(', ')}`,
  )
}
