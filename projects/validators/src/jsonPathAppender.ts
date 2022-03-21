/**
 * Incomplete regex for matching JS-like variables
 */
const REGEX = /^[$A-Za-z_$][0-9a-zA-Z_$]*$/s

/**
 * List of js keywords to avoid as unquoted
 */
const KEYWORDS: Record<string, boolean> = {
  do: true,
  if: true,
  in: true,
  for: true,
  let: true,
  new: true,
  try: true,
  var: true,
  case: true,
  else: true,
  enum: true,
  eval: true,
  false: true,
  null: true,
  this: true,
  true: true,
  void: true,
  with: true,
  break: true,
  catch: true,
  class: true,
  const: true,
  super: true,
  throw: true,
  while: true,
  yield: true,
  delete: true,
  export: true,
  import: true,
  public: true,
  return: true,
  static: true,
  switch: true,
  typeof: true,
  default: true,
  extends: true,
  finally: true,
  package: true,
  private: true,
  continue: true,
  debugger: true,
  function: true,
  arguments: true,
  interface: true,
  protected: true,
  implements: true,
  instanceof: true,
}

function transformSegment(segment: string | number): string {
  if (typeof segment === 'number') {
    return `[${segment}]`
  }
  REGEX.lastIndex = 0
  if (typeof segment === 'string' && !KEYWORDS[segment] && REGEX.test(segment)) {
    return `.${segment}`
  }
  return `["${segment}"]`
}

export function jsonPathAppender(path: string, ...segments: (string | number)[]): string {
  return [path, ...segments.map(transformSegment)].join('')
}
