import fs from 'fs/promises'
import { resolve, join, basename } from 'path'

type ItemDescriptor = {
  type: 'file' | 'folder'
  path: string
}

async function readRoots(root: string): Promise<ItemDescriptor[]> {
  const content = await fs.readdir(root, { withFileTypes: true })
  return content
    .filter((item) => item.isDirectory())
    .map(
      (item): ItemDescriptor => ({
        type: 'folder',
        path: join(root, item.name),
      }),
    )
}

async function readItemDescriptor(item: ItemDescriptor, schemas: ItemDescriptor[]) {
  if (item.type === 'file') {
    const name = basename(item.path)
    if (name === 'openapi.yaml' || name === 'openapi.json') {
      schemas.push(item)
    }
  } else {
    const content = await fs.readdir(item.path, { withFileTypes: true })
    const items = content.map(
      (ent): ItemDescriptor => ({
        path: join(item.path, ent.name),
        type: ent.isDirectory() ? 'folder' : 'file',
      }),
    )

    await Promise.all(items.map((child) => readItemDescriptor(child, schemas)))
  }
}

export async function getApiGuruSchemaPaths(root: string): Promise<string[]> {
  const roots = await readRoots(resolve(root))
  const schemas: ItemDescriptor[] = []
  await Promise.all(roots.map((item) => readItemDescriptor(item, schemas)))
  return schemas.filter((schema) => schema.type === 'file').map((schema) => schema.path)
}
