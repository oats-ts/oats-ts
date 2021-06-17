import generate from '@babel/generator'
import { program, Node } from '@babel/types'
import { BabelModule } from '../typings'

export async function defaultStringify(data: BabelModule): Promise<string> {
  const nodes: Node[] = [program(data.imports, [], 'module'), ...data.statements]
  const source = nodes.map((node) => generate(node).code).join('\n\n')
  return `${source}\n`
}
