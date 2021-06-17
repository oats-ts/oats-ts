import generate, { GeneratorOptions } from '@babel/generator'
import { program, Node } from '@babel/types'
import { BabelModule } from '../typings'

export const defaultStringify =
  (options: GeneratorOptions = {}) =>
  async (data: BabelModule): Promise<string> => {
    const nodes: Node[] = [program(data.imports, [], 'module'), ...data.statements]
    const source = nodes.map((node) => generate(node, options).code).join('\n\n')
    return `${source}\n`
  }
