import { readdir } from 'fs/promises'
import { join, parse, resolve, sep } from 'path'
import { PATH, SCHEMA_CACHE } from './constants'
import { GeneratorInputFileDescriptor } from './typings'

const cacheFolder = resolve(SCHEMA_CACHE)

async function collectFileDescriptors(path: string, descriptors: GeneratorInputFileDescriptor[]): Promise<void> {
  const dirEnt = await readdir(path, { withFileTypes: true })
  const childDirs = dirEnt.filter((d) => d.isDirectory())
  const childFiles = dirEnt.filter((d) => d.isFile())
  for (const file of childFiles) {
    const fullPath = join(path, file.name)
    const name = fullPath.replace(`${cacheFolder}${sep}`, '')
    const pureFileName = parse(fullPath).name
    const codeFilePath = join(PATH, `${pureFileName}.ts`)
    const codeFolderPath = join(PATH, pureFileName)
    descriptors.push({
      name: name.replace(/\\/g, '/'),
      schemaUri: fullPath,
      codeFilePath: codeFilePath,
      codeFolderPath: codeFolderPath,
    })
  }
  await Promise.all(childDirs.map((dir) => collectFileDescriptors(join(path, dir.name), descriptors)))
}

export async function getCachedFileDescriptors(): Promise<GeneratorInputFileDescriptor[]> {
  const descriptors: GeneratorInputFileDescriptor[] = []
  await collectFileDescriptors(cacheFolder, descriptors)
  return descriptors
}
