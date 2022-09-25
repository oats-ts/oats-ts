import { CodeGenerator, GeneratorConfig, NameProviderHelper, PathProviderHelper } from '@oats-ts/oats-ts'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { isReferenceObject } from './isReferenceObject'
import { GeneratorContext, ReadOutput } from './types'
import { NameProviderHelperImpl } from './NameProviderHelperImpl'
import { PathProviderHelperImpl } from './PathProviderHelperImpl'

export class GeneratorContextImpl<Doc, Cfg extends GeneratorConfig, Target extends string>
  implements GeneratorContext<Doc, Target>
{
  public readonly document: Doc
  public readonly documents: Doc[]
  private nameProviderHelper: NameProviderHelper
  private pathProviderHelper: PathProviderHelper

  constructor(
    private owner: CodeGenerator<any, any>,
    private data: ReadOutput<Doc>,
    readonly config: Cfg,
    readonly generators: CodeGenerator<any, any>[],
  ) {
    this.document = data.document
    this.documents = Array.from(data.documents.values())
    this.nameProviderHelper = new NameProviderHelperImpl(data)
    this.pathProviderHelper = new PathProviderHelperImpl(data, this.config.nameProvider, this.nameProviderHelper)
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
    const name = this.config.nameProvider(input, target, this.nameProviderHelper)
    if (isNil(name)) {
      throw new TypeError(`Name provider returned ${name} for "${target}" with input ${JSON.stringify(input)}`)
    }
    return name
  }
  pathOf = (input: any, target: Target): string => {
    const path = this.config.pathProvider(input, target, this.pathProviderHelper)
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
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    throw this.wrongTargetError(target, 'dependencies')
  }
  referenceOf = <T>(input: any, target: Target): T => {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    throw this.wrongTargetError(target, 'reference')
  }

  configurationOf<T>(target: Target): T {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.configuration() as T
      }
    }
    throw this.wrongTargetError(target, 'configuration')
  }

  private wrongTargetError(target: Target, requested: string): Error {
    const { owner } = this
    const deps = owner
      .consumes()
      .map((dep) => `"${dep}"`)
      .join(', ')
    return new Error(
      `"${owner.name()}" requested ${requested} of "${target}", but it doesn't declare this as consumed generator (declared [${deps}])`,
    )
  }
}
