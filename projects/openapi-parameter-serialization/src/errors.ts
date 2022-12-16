const types = ['primitive', 'array', 'object']

export function unexpectedType(type: any, expectedTypes: string[] = types): TypeError {
  return new TypeError(
    `Unexpected type "${type}". Expected${expectedTypes.length > 1 ? ' one of' : ''} ${expectedTypes
      .map((type) => `"${type}"`)
      .join(', ')}`,
  )
}

export function unexpectedStyle(style: any, expectedStyles: string[]): TypeError {
  return new TypeError(
    `Unexpected style "${style}". Expected${expectedStyles.length > 1 ? ' one of' : ''} ${expectedStyles
      .map((type) => `"${type}"`)
      .join(', ')}`,
  )
}
