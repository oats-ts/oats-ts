import { Options, format } from 'prettier'
import { BabelModule } from './typings'
import generate from '@babel/generator'
import { program, Node } from '@babel/types'

export const prettierStringify =
  (options: Options) =>
  async (data: BabelModule): Promise<string> => {
    const nodes: Node[] = [program(data.imports, [], 'module'), ...data.statements]
    const source = nodes.map((node) => generate(node, { compact: true }).code).join('\n\n')
    return format(source, options)
  }
