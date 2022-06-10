import { CompositeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { mergeSourceFiles } from '@oats-ts/typescript-common'
import { SourceFile } from 'typescript'

export class GroupGenerator extends CompositeGenerator<OpenAPIReadOutput, SourceFile> {
  protected flatten(output: SourceFile[]): SourceFile[] {
    return mergeSourceFiles(output)
  }
}
