import { promises as fs } from 'fs'
import { resolve } from 'path'
import { GeneratorModel } from './GeneratorModel'

export async function generateSchema({ schema, schemaPath }: GeneratorModel) {
  return fs.writeFile(resolve(schemaPath), JSON.stringify(schema(), null, 2), { encoding: 'utf-8' })
}
