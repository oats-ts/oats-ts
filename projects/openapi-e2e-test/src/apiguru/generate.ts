import { generate } from '@oats-ts/oats-ts'
import { validator, readers, writers, presets, nameProviders, pathProviders, generator } from '@oats-ts/openapi'
import { isSuccess, stringify } from '@oats-ts/openapi-runtime'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { chunk, isNil } from 'lodash'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getApiGuruSchemaPaths } from './getApiGuruSchemaPaths'

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
      default: '../../../openapi-directory/APIs',
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
      default: true,
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

async function generateAll() {
  if (cliArgs.clear) {
    console.log(`Clearing ${resolve(OUTPUT_FILE)}...`)
    await writeFile(resolve(OUTPUT_FILE), '', 'utf-8')
  }

  let failures = 0

  console.log(`Discovering OpenAPI files in ${resolve(cliArgs.dir)}...`)
  const files = isNil(cliArgs.file) ? await getApiGuruSchemaPaths(cliArgs.dir) : [resolve(cliArgs.file)]
  console.log(`Discovered ${files.length} OpenAPI files in ${resolve(cliArgs.dir)}`)
  const filesInChunks = chunk(files, CHUNK_SIZE)
  console.log(`Files split into ${filesInChunks.length} chunks of ${CHUNK_SIZE} files`)

  for (let i = 0; i < filesInChunks.length; i += 1) {
    failures += await generateChunk(filesInChunks[i]!, i)
  }

  console.log()
  console.log(`Done. ${files.length}/${failures} errors`)
}

generateAll()
