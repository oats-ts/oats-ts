import { generateFromOpenAPIDocument } from './generateFromOpenAPIDocument'
import { getFiles } from './getFiles'
import { getCodePath, getSchemaUrl } from './utils'
import inquerer from 'inquirer'
import fs from 'fs/promises'
import { PATH } from './constants'

type InquererResult = {
  documents: string[]
  pathType: 'default' | 'singleFile' | 'byTarget' | 'byName'
  clear: boolean
}

const ALL_DOCS = 'All documents'

async function generateAll() {
  const files = await getFiles(['schemas', 'generated-schemas'])
  const result = await inquerer.prompt<InquererResult>([
    {
      type: 'checkbox',
      name: 'documents',
      message: 'Select the OpenAPI documents you want to generate from:',
      default: ALL_DOCS,
      choices: [ALL_DOCS, ...files],
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
  console.log()

  if (result.clear) {
    await fs.rm(PATH, { force: true, recursive: true })
  }

  const selectedDocuments = result.documents.includes(ALL_DOCS) ? files : result.documents
  for (const path of selectedDocuments) {
    console.log(path)
    await generateFromOpenAPIDocument(
      path,
      getSchemaUrl(path),
      getCodePath(path, result.pathType === 'singleFile'),
      result.pathType,
    )
    console.log()
  }
}

generateAll()
