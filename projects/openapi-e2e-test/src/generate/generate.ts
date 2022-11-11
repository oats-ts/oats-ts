import { generateFromOpenAPIDocument } from './generateFromOpenAPIDocument'
import inquerer from 'inquirer'
import fs from 'fs/promises'
import { PATH, SCHEMA_CACHE } from './constants'
import { GeneratorInputFileDescriptor, LoadMethod } from './typings'
import { getGithubFileDescriptors } from './getGithubFileDescriptors'
import { getCachedFileDescriptors } from './getCachedFileDescriptors'
import { resolve } from 'path'

type GenerateOptions = {
  documents: string[]
  pathType: 'default' | 'singleFile' | 'byTarget' | 'byName'
  clear: boolean
}

const ALL_DOCS = 'All documents'

const DefaultOptions: GenerateOptions = {
  documents: [ALL_DOCS],
  pathType: 'byTarget',
  clear: false,
}

async function promptForResult(files: GeneratorInputFileDescriptor[]) {
  return inquerer.prompt<GenerateOptions>([
    {
      type: 'checkbox',
      name: 'documents',
      message: 'Select the OpenAPI documents you want to generate from:',
      default: ALL_DOCS,
      choices: [ALL_DOCS, ...files.map((file) => file.name)],
    },
    {
      type: 'list',
      name: 'pathType',
      message: 'Select pathing mechanism:',
      default: 'byTarget',
      choices: ['default', 'singleFile', 'byTarget', 'byName'],
    },
    {
      type: 'confirm',
      name: 'clear',
      default: false,
      message: 'Clear folder src/generated?',
    },
  ])
}

async function doGenerate(files: GeneratorInputFileDescriptor[], result: GenerateOptions, method: LoadMethod) {
  console.log()

  if (result.clear) {
    await fs.rm(PATH, { force: true, recursive: true })
  }

  const selectedDocuments = result.documents.includes(ALL_DOCS)
    ? files
    : result.documents.map((doc) => files.find((f) => f.name === doc)!)

  for (const { codeFilePath, codeFolderPath, name, schemaUri } of selectedDocuments) {
    console.log(name)
    await generateFromOpenAPIDocument(
      name,
      schemaUri,
      result.pathType === 'singleFile' ? codeFilePath : codeFolderPath,
      method,
      result.pathType,
    )
    console.log()
  }
}

function getLoadMethod(args: string[]): LoadMethod {
  if (args.includes('-r') || args.includes('--remote')) {
    return 'https'
  }
  return 'file'
}

async function getFileDescriptors(method: LoadMethod): Promise<GeneratorInputFileDescriptor[]> {
  switch (method) {
    case 'file': {
      console.log(`Fetching files from local cache (${resolve(SCHEMA_CACHE)})...`)
      return getCachedFileDescriptors()
    }
    case 'https': {
      console.log('Fetching files from Github...')
      return getGithubFileDescriptors()
    }
  }
}

async function getOptions(args: string[], files: GeneratorInputFileDescriptor[]): Promise<GenerateOptions> {
  if (args.includes('-i') || args.includes('--interactive')) {
    return promptForResult(files)
  }
  return DefaultOptions
}

async function generateAll() {
  const args = process.argv.slice(2)
  const method = getLoadMethod(args)
  const files = await getFileDescriptors(method)
  const options = await getOptions(args, files)
  return doGenerate(files, options, method)
}

generateAll()
