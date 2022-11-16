export function findByFragments<T>(document: any, fragments: string[]): T {
  if (fragments.length === 0) {
    return document
  }
  const [head, ...tail] = fragments
  return findByFragments(document[head], tail)
}
