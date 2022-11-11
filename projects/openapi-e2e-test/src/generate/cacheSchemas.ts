/**
 * This file exists, so while testing I don't constantly ping githubs raw file APIs
 *
 * usage: pnpm load-schemas
 */

import fetch from 'node-fetch'
import { SCHEMA_CACHE } from './constants'
import { exists, getSchemaUrl } from './utils'
import { dirname, join, resolve } from 'path'
import { promises as fs } from 'fs'
import { LocalFileDescriptor } from './typings'
import { getGithubFiles } from './getGithubFiles'

async function loadGithubFile(path: string): Promise<LocalFileDescriptor> {
  const response = await fetch(getSchemaUrl(path))
  const content = await response.text()
  return {
    path,
    content,
    filePath: resolve(join(SCHEMA_CACHE, path)),
  }
}

async function loadGithubFiles(paths: string[]): Promise<LocalFileDescriptor[]> {
  return Promise.all(paths.map((path) => loadGithubFile(path)))
}

async function writeLocalFile(file: LocalFileDescriptor): Promise<void> {
  const dir = dirname(file.filePath)
  if (!(await exists(dir))) {
    await fs.mkdir(dir, { recursive: true })
  }
  return fs.writeFile(file.filePath, file.content, 'utf-8')
}

async function writeLocalFiles(files: LocalFileDescriptor[]): Promise<void> {
  for (const file of files) {
    await writeLocalFile(file)
  }
}

async function cacheSchemas() {
  try {
    const paths = await getGithubFiles()
    const files = await loadGithubFiles(paths)
    await writeLocalFiles(files)
  } catch (e) {
    console.error(e)
  }
}

cacheSchemas()
