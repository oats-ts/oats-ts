const { readdir, readFile, writeFile, unlink, stat, access } = require('fs/promises')
const { join, resolve, basename } = require('path')

const PROJECTS_FOLDER = resolve('projects')
const HOMEPAGE = 'https://oats-ts.github.io/docs'
const REPO_URL = 'https://github.com/oats-ts/oats-ts'
const LICENSE_NAME = 'MIT'
const TSCONFIG_FILE_NAME = 'tsconfig.json'
const WORKSPACE_FILE_NAME = 'oats.code-workspace'
const RUSH_FILE_NAME = 'rush.json'
const LICENSE_FILE_NAME = 'LICENSE.txt'
const README_FILE_NAME = 'readme.md'
const PACKAGE_JSON_FILE_NAME = 'package.json'
const LOG_IGNORE_FOLDERS = ['node_modules', '.git']
const LOG_ENDINGS = ['.build.log', '.build.error.log', '.pnpm-debug.log']
const NO_PUBLISH_PROJECTS = ['openapi-e2e-test']

const LICENSE_TEXT = `Copyright ${new Date().getFullYear()} Balázs Édes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`

const COMPILER_OPTIONS = {
  strict: true,
  noImplicitAny: true,
  noUnusedLocals: true,
  target: 'ES2018',
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

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
 * @param {string[]} files
 * @param {boolean} readmeExists
 * @return {string[]}
 */
function updateFiles(files, readmeExists) {
  if (!files.includes(LICENSE_FILE_NAME)) {
    files.push(LICENSE_FILE_NAME)
  }
  if (readmeExists && !files.includes(README_FILE_NAME)) {
    files.push(README_FILE_NAME)
  }
  return files.sort().filter((f) => f !== 'src')
}

/**
 * @param {string} folder
 * @returns {Promise<void>}
 */
async function updatePackageJson(folder) {
  const path = join(folder, PACKAGE_JSON_FILE_NAME)
  const content = JSON.parse(await readFile(path, 'utf-8'))
  content.license = LICENSE_NAME
  content.homepage = HOMEPAGE

  const readmeExists = await exists(join(folder, README_FILE_NAME))
  const files = updateFiles(Array.from(content.files ?? []), readmeExists)
  const hasFiles = Array.isArray(content.files)

  content.name = `@oats-ts/${basename(folder)}`
  if (hasFiles) {
    content.files = files
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
 */
async function updateTsConfig(folder) {
  const path = join(folder, TSCONFIG_FILE_NAME)
  if (!(await exists(path))) {
    return
  }
  const tsconfig = JSON.parse(await readFile(path, 'utf-8'))
  tsconfig.compilerOptions = { ...tsconfig.compilerOptions, ...COMPILER_OPTIONS }
  return writeFile(path, JSON.stringify(tsconfig, sortReplacer, 2), 'utf-8')
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

/**
 * @param {string[]} folders
 * @returns {Promise<void>}
 */
async function updateCodeWorkspace(folders) {
  const root = { name: 'root', path: '.' }
  const mappedFolders = [root].concat(folders.map((folder) => ({ name: folder, path: `projects/${folder}` })))
  const content = JSON.stringify({ folders: mappedFolders }, null, 2)
  await writeFile(join(resolve(), WORKSPACE_FILE_NAME), content, 'utf-8')
}

/**
 * @param {string[]} folders
 * @returns {Promise<void>}
 */
async function updateRush(folders) {
  const rushPath = join(resolve(), RUSH_FILE_NAME)
  const content = JSON.parse(await readFile(rushPath, 'utf-8'))
  const projects = folders.map((folder) => {
    const shouldPublish = !NO_PUBLISH_PROJECTS.includes(folder)
    const project = {
      packageName: `@oats-ts/${folder}`,
      projectFolder: `projects/${folder}`,
      shouldPublish,
      ...(shouldPublish ? { versionPolicyName: 'oats' } : {}),
    }
    return project
  })
  content.projects = projects
  await writeFile(rushPath, JSON.stringify(content, null, 2), 'utf-8')
}

async function run() {
  const rootFolders = (await readdir(PROJECTS_FOLDER)).sort((a, b) => a.localeCompare(b))

  await updateLicenseTxt(resolve())
  await deleteLogs(resolve())

  for (const folder of rootFolders) {
    const folderPath = join(PROJECTS_FOLDER, folder)
    await updateTsConfig(folderPath)
    await updatePackageJson(folderPath)
    await updateLicenseTxt(folderPath)
  }

  await updateCodeWorkspace(rootFolders)
  await updateRush(rootFolders)
}

run()
