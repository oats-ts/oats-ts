const { readdir, readFile } = require('fs/promises')
const { join, resolve } = require('path')

/**
 * @typedef {import('fs').Dirent} Dirent
 */

/**
 * @param {string} path
 * @param {string} source
 * @param {string[]} inPkgJson
 * @param {Set<string>} externals
 * @returns {void}
 */
function collectExternalPackages(path, source, inPkgJson, externals) {
  source
    .split('\n')
    .filter((line) => line.startsWith('import ') && line.includes(' from '))
    .map((line) => line.split(' from ')[1].trim().replaceAll('"', '').replaceAll("'", ''))
    .filter((pkg) => !pkg.startsWith('.'))
    .filter((pkg) => !inPkgJson.includes(pkg))
    .forEach((pkg) => externals.push(`${path.replaceAll('\\', '/')}    ${pkg}`))
}

/**
 * @param {string} parent
 * @param {Dirent} item
 * @param {string[]} inPkgJson
 * @param {string[]} externals
 * @returns {Promise<void>}
 */
async function processItem(parent, item, inPkgJson, externals) {
  if (item.isFile() && item.name.endsWith('.ts')) {
    const filePath = join(parent, item.name)
    const source = await readFile(filePath, 'utf-8')
    collectExternalPackages(filePath, source, inPkgJson, externals)
  } else if (item.isDirectory()) {
    const dirPath = join(parent, item.name)
    const items = await readdir(dirPath, { withFileTypes: true })
    const filteredItems = items.filter((item) => !item.name.endsWith('.test.ts'))
    return Promise.all(filteredItems.map((child) => processItem(dirPath, child, inPkgJson, externals)))
  } else {
    throw new TypeError(`Unexpected input ${item}`)
  }
}
/**
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
async function readInPkgJson(folder) {
  const path = join(folder, 'package.json')
  const content = await readFile(path, 'utf-8')
  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  } = JSON.parse(content)
  return Object.keys(dependencies)
    .concat(Object.keys(devDependencies))
    .concat(Object.keys(peerDependencies))
    .concat(Object.keys(optionalDependencies))
}

async function listExternalDeps() {
  const root = resolve('projects')
  const rootFolders = (await readdir(root, { withFileTypes: true })).filter((item) => item.name !== 'openapi-e2e-test')
  const externals = []

  for (const folder of rootFolders) {
    const parent = join(root, folder.name)
    const itemsInFolder = await readdir(parent, { withFileTypes: true })
    const src = itemsInFolder.find((item) => item.name === 'src')
    const inPkgJson = await readInPkgJson(parent)
    if (src !== undefined) {
      await processItem(parent, src, inPkgJson, externals)
    }
  }

  console.log(Array.from(externals))
}

listExternalDeps()
