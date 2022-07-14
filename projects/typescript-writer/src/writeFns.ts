import { resolve, dirname } from 'path'
import { promises } from 'fs'
import { SourceFile } from 'typescript'
import { OutputFile } from './typings'

export async function memoryWrite(path: string, content: string, _file: SourceFile): Promise<OutputFile> {
  return { path, content }
}

async function exists(dir: string): Promise<boolean> {
  try {
    const stats = await promises.lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

export async function fileWrite(path: string, content: string, _file: SourceFile): Promise<OutputFile> {
  const _path = resolve(path)
  const dir = dirname(_path)
  const dirExists = await exists(dir)
  if (!dirExists) {
    await promises.mkdir(dir, { recursive: true })
  }
  await promises.writeFile(_path, content, { encoding: 'utf-8' })
  return { path, content }
}
