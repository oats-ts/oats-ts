import { relative, dirname, sep, parse, join } from 'path'

function removeExtension(path: string): string {
  const { root, dir, name } = parse(path)
  return join(root, dir, name)
}

export function getImportPath(from: string, to: string): string {
  if (from === to) {
    return undefined
  }

  const relativePath = removeExtension(relative(dirname(from), to))
    .split(sep)
    .join('/')

  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`
}
