import { resolve, dirname } from 'path'
import { promises } from 'fs'

async function exists(dir: string): Promise<boolean> {
  try {
    const stats = await promises.lstat(dir)
    return stats.isDirectory()
  } catch (e) {
    return false
  }
}

export async function defaultWrite(path: string, content: string): Promise<void> {
  const _path = resolve(path)
  const dir = dirname(_path)
  const dirExists = await exists(dir)
  if (!dirExists) {
    await promises.mkdir(dir, { recursive: true })
  }
  await promises.writeFile(_path, content, { encoding: 'utf-8' })
}
