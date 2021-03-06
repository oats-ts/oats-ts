import { CodeGenerator, GeneratorConfig } from '@oats-ts/oats-ts'
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
  dereference = <T>(input: string | ReferenceObject | T, deep?: boolean): T => {
    if (typeof input === 'string') {
      return deep ? this.dereference(this.data.uriToObject.get(input)) : this.data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return deep ? this.dereference(this.data.uriToObject.get(input.$ref)) : this.data.uriToObject.get(input.$ref)
    }
    return input
  }
  nameOf = (input: any, target?: Target): string => {
    const originalName = this.data.objectToName.get(input)
    if (isNil(target)) {
      return originalName!
    }
    const name = this.config.nameProvider(input, originalName, target)
    if (isNil(name)) {
      try {
        throw new TypeError(`Name provider returned ${name} for "${target}" with input ${JSON.stringify(input)}`)
      } catch (e) {
        console.error(e)
      }
    }
    return name
  }
  pathOf = (input: any, target: Target): string => {
    const nameProvider = (input: any, target: string) => this.nameOf(input, target as Target)
    const path = this.config.pathProvider(input, nameProvider, target)
    if (isNil(path)) {
      throw new TypeError(`Path provider returned ${path} for "${target}" with input ${JSON.stringify(input)}`)
    }
    return path
  }
  uriOf = (input: any): string => {
    const uri = this.data.objectToUri.get(input)
    if (isNil(uri)) {
      throw new Error(
        `Input ${JSON.stringify(
          input,
        )} doesn't have a valid URI. This means it's either not part of an OpenAPI document, or you found a bug in the reader.`,
      )
    }
    return uri
  }
  dependenciesOf = (fromPath: string, input: any, target: Target): ImportDeclaration[] => {
    const { owner, generators } = this
    for (const generator of generators) {
      if (generator.name() === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    throw new Error(
      `Generator "${owner.name()}" requested dependencies of "${target}", but it doesn't declare this as consumed (declared [${owner
        .consumes()
        .map((dep) => `"${dep}"`)
        .join(', ')}])`,
    )
  }
  referenceOf = <T>(input: any, target: Target): T => {
    const { owner, generators } = this
    for (const generator of generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    throw new Error(
      `Generator "${owner.name()}" requested reference of "${target}", but it doesn't declare this as consumed (declared [${owner
        .consumes()
        .map((dep) => `"${dep}"`)
        .join(', ')}])`,
    )
  }
}
