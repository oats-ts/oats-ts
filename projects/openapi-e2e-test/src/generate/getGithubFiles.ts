import { REPO } from './constants'
import fetch from 'node-fetch'

export type FileDescriptor = {
  path: string
  mode: string
  type: 'tree' | 'blob'
  sha: string
  size: number
  url: string
}

export async function getGithubFiles(folders: string[] = ['schemas', 'generated-schemas']): Promise<string[]> {
  const response = await fetch(`https://api.github.com/repos/${REPO}/git/trees/master?recursive=true`)
  const tree = ((await response.json()) as any).tree as FileDescriptor[]
  return tree
    .filter((file) => file.type !== 'tree')
    .filter((file) => folders.some((folder) => file.path.startsWith(`${folder}/`)))
    .filter((file) => file.path.endsWith('.json') || file.path.endsWith('.yaml'))
    .map((file) => file.path)
}
