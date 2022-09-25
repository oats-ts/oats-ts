import { join, parse } from 'path'
import { PATH, REPO } from './constants'

export function getSchemaUrl(path: string): string {
  return `https://raw.githubusercontent.com/${REPO}/master/${path}`
}

export function getCodePath(path: string, hasExtension: boolean): string {
  return join(PATH, `${parse(path).name}${hasExtension ? '.ts' : ''}`)
}
