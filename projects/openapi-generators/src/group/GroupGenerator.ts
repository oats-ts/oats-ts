import { CompositeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'

export class GroupGenerator extends CompositeGenerator<OpenAPIReadOutput, SourceFile> {}
