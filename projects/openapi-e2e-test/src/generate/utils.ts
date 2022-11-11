import { lstat } from 'fs/promises'
import { REPO } from './constants'

export function getSchemaUrl(path: string): string {
  return `https://raw.githubusercontent.com/${REPO}/master/${path}`
}

export async function exists(dir: string): Promise<boolean> {
  try {
    const stats = await lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}
