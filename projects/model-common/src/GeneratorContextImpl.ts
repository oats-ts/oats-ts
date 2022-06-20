import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { isReferenceObject } from './isReferenceObject'
import { GeneratorContext, ReadOutput } from './types'

export class GeneratorContextImpl<Doc, Cfg extends GeneratorConfig, Target extends string>
  implements GeneratorContext<Doc, Target>
{
  public readonly document: Doc
  public readonly documents: Doc[]

  constructor(
    private owner: CodeGenerator<any, any>,
    private data: ReadOutput<Doc>,
    readonly config: Cfg,
    readonly generators: CodeGenerator<any, any>[],
  ) {
    this.document = data.document
    this.documents = Array.from(data.documents.values())
  }
  dependenciesOf = (fromPath: string, input: any, target: Target): ImportDeclaration[] => {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    throw new Error(
      `Generator "${this.owner.name()}" requested dependencies of "${target}", but it doesn't declare this as consumed (declared [${this.owner
        .consumes()
        .map((dep) => `"${dep}"`)
        .join(', ')}])`,
    )
  }
  dereference = <T>(input: string | ReferenceObject | T, deep?: boolean): T => {
    if (typeof input === 'string') {
      return deep ? this.dereference(this.data.uriToObject.get(input)) : this.data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return deep ? this.dereference(this.data.uriToObject.get(input.$ref)) : this.data.uriToObject.get(input.$ref)
    }
    return input
  }
  nameOf = (input: any, target?: Target): string => {
    if (isNil(this.config) || isNil(target)) {
      return this.data.objectToName.get(input)
    }
    return this.config.nameProvider(input, this.data.objectToName.get(input), target)
  }
  pathOf = (input: any, target: Target): string => {
    if (isNil(this.config) || isNil(target)) {
      return undefined
    }
    const nameProvider = (input: any, target: string) => this.nameOf(input, target as Target)
    return this.config.pathProvider(input, nameProvider, target)
  }
  uriOf = (input: any): string => {
    return this.data.objectToUri.get(input)
  }
  referenceOf = <T>(input: any, target: Target): T => {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    throw new Error(
      `Generator "${this.owner.name()}" requested reference of "${target}", but it doesn't declare this as consumed (declared [${this.owner
        .consumes()
        .map((dep) => `"${dep}"`)
        .join(', ')}])`,
    )
  }
}
