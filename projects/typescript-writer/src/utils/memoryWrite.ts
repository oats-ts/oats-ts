import { success, Try } from '@oats-ts/try'
import { SourceFile } from 'typescript'
import { GeneratedFile } from '../typings'

export async function memoryWrite(path: string, content: string, _file: SourceFile): Promise<Try<GeneratedFile>> {
  return success({ path, content })
}
