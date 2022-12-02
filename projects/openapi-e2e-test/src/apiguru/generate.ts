import { generate } from '@oats-ts/oats-ts'
import { validator, readers, writers, presets, nameProviders, pathProviders, generator } from '@oats-ts/openapi'
import { isSuccess, stringify } from '@oats-ts/openapi-runtime'
import { readdir, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { chunk } from 'lodash'

const CHUNK_SIZE = 10

export async function generateSingleDocument(inputPath: string, ouptutPath: string): Promise<string> {
  try {
    const result = await generate({
      validator: validator(),
      reader: readers.file.mixed(inputPath),
      generator: generator({
        nameProvider: nameProviders.default(),
        pathProvider: pathProviders.singleFile(ouptutPath),
        children: presets.fullStack({
          cors: true,
          debugCookies: true,
          documentation: true,
          validateResponses: true,
        }),
      }),
      writer: writers.typescript.memory({}),
    })
    if (isSuccess(result)) {
      return `✓ ${inputPath}`
    }
    return `✕ ${inputPath}\n${result.issues.map((issue) => `  ${stringify(issue)}`)}`
  } catch (e) {
    const err = e as Error
    return `✕ ${inputPath}\n${err}\n${err.stack}`
  }
}

async function generateChunk(files: string[], index: number): Promise<void> {
  console.log(`Processing chunk ${index}`)
  const output = await Promise.all(files.map((file) => generateSingleDocument(file, resolve('test.ts'))))
  await writeFile(resolve('.apiguru.txt'), output.join('\n\n').concat('\n\n'), { flag: 'a+', encoding: 'utf-8' })
}

async function generateAll() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    throw new Error('Path is necessary as first argument')
  }
  const root = resolve(args[0]!)
  const items = await readdir(root, { withFileTypes: true })
  const files = items.filter((item) => item.isFile()).map((item) => join(root, item.name))
  const filesInChunks = chunk(files, CHUNK_SIZE)

  for (let i = 0; i < filesInChunks.length; i += 1) {
    const f = filesInChunks[i]!
    await generateChunk(f, i)
  }
}

generateAll()
