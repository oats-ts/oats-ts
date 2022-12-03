import { generate } from '@oats-ts/oats-ts'
import { validator, readers, writers, presets, nameProviders, pathProviders, generator } from '@oats-ts/openapi'
import { isSuccess, stringify } from '@oats-ts/openapi-runtime'
import { readdir, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { chunk } from 'lodash'

const CHUNK_SIZE = 10
const OUTPUT_FILE = resolve('.apiguru.txt')

type ResultType = 'ok' | 'error' | 'thrown'

export async function generateSingleDocument(inputPath: string, ouptutPath: string): Promise<[string, ResultType]> {
  try {
    const result = await generate({
      validator: validator(),
      reader: readers.file.yaml(inputPath),
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
      return [`✓ ${inputPath}`, 'ok']
    }
    const issuesStr = result.issues
      .filter((issue) => issue.severity === 'error')
      .map((issue) => `  ${stringify(issue)}`)
      .join('\n')
    return [`✕ ${inputPath}\n${issuesStr}`, 'error']
  } catch (e) {
    const err = e as Error
    return [`✕ ${inputPath}\n${err}\n${err.stack}`, 'thrown']
  }
}

async function generateChunk(files: string[], index: number): Promise<number> {
  const output = await Promise.all(files.map((file) => generateSingleDocument(file, resolve('test.ts'))))
  const content = output
    .map(([data]) => data)
    .join('\n\n')
    .concat('\n\n')
  await writeFile(OUTPUT_FILE, content, { flag: 'a+', encoding: 'utf-8' })
  const issues = output
    .map(([, result]) => result)
    .filter((result) => result !== 'ok')
    .map(() => 1)
    .reduce((a, b) => a + b, 0)
  console.log(`Processed chunk ${index + 1}. (${CHUNK_SIZE}/${issues}) errors`)
  return issues
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

  await writeFile(OUTPUT_FILE, '', 'utf-8')

  let failures = 0

  for (let i = 0; i < filesInChunks.length; i += 1) {
    const f = filesInChunks[i]!
    failures += await generateChunk(f, i)
  }

  console.log()
  console.log(`Done. ${files.length}/${failures} errors`)
}

generateAll()
