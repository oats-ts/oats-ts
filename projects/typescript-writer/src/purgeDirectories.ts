import { TypeScriptModule } from './typings'
import { promises as fs } from 'fs'
import { dirname } from 'path'

export async function purgeDirectories(modules: TypeScriptModule[]) {
  const paths = Array.from(new Set(modules.map((m) => dirname(m.path))))
  return Promise.all(paths.map((path) => fs.rm(path, { recursive: true, force: true })))
}
