import { generateCode } from './generateCode'
import { models } from './models'

async function generate() {
  for (const model of models) {
    await generateCode(model)
  }
}

generate()
