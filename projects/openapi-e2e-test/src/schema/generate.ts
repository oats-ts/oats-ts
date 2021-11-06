import { promises as fs } from 'fs'
import { resolve } from 'path'
import { generateParametersOpenApiObject } from './parameters/generateParametersOpenApiObject'

async function generateFile(input: any, path: string) {
  const content = typeof input === 'string' ? input : JSON.stringify(input, null, 2)
  return fs.writeFile(resolve(path), content, { encoding: 'utf-8' })
}

async function generateFiles() {
  await generateFile(generateParametersOpenApiObject(), 'schemas/parameters.json')
}

generateFiles()
