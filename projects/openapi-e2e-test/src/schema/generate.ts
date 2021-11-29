import { generateCode } from './generateCode'
import { generateSchema } from './generateSchema'
import { models } from './models'

async function generate() {
  for (const model of models) {
    await generateSchema(model)
    await generateCode(model)
  }
}

generate()
