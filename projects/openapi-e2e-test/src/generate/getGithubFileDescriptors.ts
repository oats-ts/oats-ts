import { join, parse } from 'path'
import { PATH } from './constants'
import { getGithubFiles } from './getGithubFiles'
import { GeneratorInputFileDescriptor } from './typings'
import { getSchemaUrl } from './utils'

function getCodeFolderPath(path: string): string {
  return join(PATH, parse(path).name)
}

function getCodeFilePath(path: string): string {
  return join(PATH, `${parse(path).name}${'.ts'}`)
}

export async function getGithubFileDescriptors(): Promise<GeneratorInputFileDescriptor[]> {
  const files = await getGithubFiles()
  return files.map((file) => ({
    name: file,
    schemaUri: getSchemaUrl(file),
    codeFilePath: getCodeFilePath(file),
    codeFolderPath: getCodeFolderPath(file),
  }))
}
