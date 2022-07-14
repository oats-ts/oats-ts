import { failure, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import { SourceFile } from 'typescript'
import { GeneratedFile } from '../typings'

export async function fileWrite(path: string, content: string, _file: SourceFile): Promise<Try<GeneratedFile>> {
  return failure([
    {
      message: `Can't write to file "${path}"`,
      path: path,
      severity: 'error',
      type: IssueTypes.other,
    },
  ])
}
