import generate from '@babel/generator'
import { program, Statement } from '@babel/types'
import { BabelModule } from '../typings'

export async function defaultStringify(data: BabelModule): Promise<string> {
  const content: Statement[] = (data.imports as Statement[]).concat(data.statements)
  const ast = program(content, [], 'module')
  return generate(ast, { compact: false }).code
}
