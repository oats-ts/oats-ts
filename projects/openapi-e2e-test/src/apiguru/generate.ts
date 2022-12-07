import { generate } from '@oats-ts/oats-ts'
import { validator, readers, writers, presets, nameProviders, pathProviders, generator } from '@oats-ts/openapi'
import { isSuccess, stringify } from '@oats-ts/openapi-runtime'
import { readdir, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { chunk } from 'lodash'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const CHUNK_SIZE = 10
const OUTPUT_FILE = resolve('.apiguru.txt')

type ResultType = 'ok' | 'error' | 'thrown'

type CliArgs = {
  _: string[]
  dir: string
  file: string
  clear: boolean
}

const cliArgs = yargs(hideBin(process.argv))
  .command('run', 'Runs the generator', {
    dir: {
      alias: 'd',
      // TODO
      default: 'E:\\code\\apiguru-openapi-schemas',
      string: true,
      implies: 'clear',
    },
    file: {
      alias: 'f',
      string: true,
      default: undefined,
    },
    clear: {
      alias: 'c',
      boolean: true,
      default: false,
    },
  })
  .demandCommand()
  .parseSync() as unknown as CliArgs

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
  const output = (await Promise.all(files.map((file) => generateSingleDocument(file, resolve('test.ts'))))).filter(
    ([, type]) => type !== 'ok',
  )

  if (output.length > 0) {
    const content = output
      .map(([data]) => data)
      .join('\n\n')
      .concat('\n\n')
    await writeFile(OUTPUT_FILE, content, { flag: 'a+', encoding: 'utf-8' })
  }

  const issues = output
    .map(([, result]) => result)
    .filter((result) => result !== 'ok')
    .map(() => 1)
    .reduce((a, b) => a + b, 0)
  console.log(`Processed chunk ${index + 1}. (${CHUNK_SIZE}/${issues}) errors`)
  return issues
}

async function getFiles(): Promise<string[]> {
  if (cliArgs.file) {
    return [cliArgs.file]
  } else {
    const items = await readdir(cliArgs.dir, { withFileTypes: true })
    return items.filter((item) => item.isFile()).map((item) => join(cliArgs.dir, item.name))
  }
}

async function generateAll() {
  if (cliArgs.clear) {
    await writeFile(OUTPUT_FILE, '', 'utf-8')
  }

  let failures = 0

  const files = await getFiles()
  const filesInChunks = chunk(files, CHUNK_SIZE)

  for (let i = 0; i < filesInChunks.length; i += 1) {
    const f = filesInChunks[i]!
    failures += await generateChunk(f, i)
  }

  console.log()
  console.log(`Done. ${files.length}/${failures} errors`)
}

generateAll()
