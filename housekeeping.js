const { readdir, readFile, writeFile, unlink, stat } = require('fs/promises')
const { join, resolve } = require('path')

const HOMEPAGE = 'https://oats-ts.github.io/docs'
const REPO_URL = 'https://github.com/oats-ts/oats-ts'
const LICENSE_NAME = 'MIT'
const LICENSE_FILE_NAME = 'LICENSE.txt'
const LOG_IGNORE_FOLDERS = ['node_modules', '.git']
const LOG_ENDINGS = ['.build.log', '.pnpm-debug.log']

const LICENSE_TEXT = `Copyright ${new Date().getFullYear()} Balázs Édes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`

/**
 * @param {string?} key
 * @param {any} value
 * @returns {any}
 */
function sortReplacer(key, value) {
  if (key === null || key === undefined || key.length === 0) {
    return value
  }
  if (!(value instanceof Object) || Array.isArray(value)) {
    return value
  }
  return Object.keys(value)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = value[key]
      return sorted
    }, {})
}

/**
 * @param {string} folder
 * @returns {Promise<void>}
 */
async function updatePackageJson(folder) {
  const path = join(folder, 'package.json')
  const content = JSON.parse(await readFile(path, 'utf-8'))
  content.license = LICENSE_NAME
  content.homepage = HOMEPAGE
  if (content.files && !content.files.includes(LICENSE_FILE_NAME)) {
    content.files.push(LICENSE_FILE_NAME)
  }
  if (content.bugs) {
    content.bugs.url = `${REPO_URL}/issues`
  }
  if (content.repository) {
    content.repository.url = `git+${REPO_URL}.git`
  }
  return writeFile(path, `${JSON.stringify(content, sortReplacer, 2)}\n`, 'utf8')
}

/**
 * @param {string} folder
 * @returns {Promise<void>}
 */
async function updateLicenseTxt(folder) {
  const path = join(folder, LICENSE_FILE_NAME)
  return writeFile(path, LICENSE_TEXT, 'utf8')
}

/**
 * @param {string} folder
 * @returns {Promise<void>}
 */
async function deleteLogs(folder) {
  const dirContents = await readdir(folder)

  for (const path of dirContents) {
    if (LOG_IGNORE_FOLDERS.includes(path)) {
      continue
    }
    const fullPath = join(folder, path)
    const pathStat = await stat(fullPath)
    if (pathStat.isDirectory()) {
      await deleteLogs(fullPath)
    } else {
      if (pathStat.isFile() && LOG_ENDINGS.some((ending) => fullPath.endsWith(ending))) {
        await unlink(fullPath)
      }
    }
  }
}

async function run() {
  const projects = resolve('projects')
  const rootFolders = await readdir(projects)

  await updateLicenseTxt(resolve())
  await deleteLogs(resolve())

  for (const folder of rootFolders) {
    const folderPath = join(projects, folder)
    await updatePackageJson(folderPath)
    await updateLicenseTxt(folderPath)
  }
}

run()
