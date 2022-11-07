import {
  CodeGenerator,
  GeneratorConfig,
  NameProviderHelper,
  PathProviderHelper,
  GeneratorContext,
} from '@oats-ts/oats-ts'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { isReferenceObject } from './isReferenceObject'
import { LocalNameDefaults, ReadOutput } from './types'
import { NameProviderHelperImpl } from './NameProviderHelperImpl'
import { PathProviderHelperImpl } from './PathProviderHelperImpl'

export class GeneratorContextImpl<
  Doc,
  Cfg extends GeneratorConfig,
  Target extends string,
  Locals extends LocalNameDefaults = {},
> implements GeneratorContext<Doc, Target, keyof Locals & string>
{
  public readonly _document: Doc
  public readonly _documents: Doc[]
  private nameProviderHelper: NameProviderHelper
  private pathProviderHelper: PathProviderHelper

  public constructor(
    private owner: CodeGenerator<any, any>,
    private data: ReadOutput<Doc>,
    readonly config: Cfg,
    readonly generators: CodeGenerator<any, any>[],
    readonly locals: Locals,
  ) {
    this._document = data.document
    this._documents = Array.from(data.documents.values())
    this.nameProviderHelper = new NameProviderHelperImpl(data)
    this.pathProviderHelper = new PathProviderHelperImpl(data, this.config.nameProvider, this.nameProviderHelper)
  }

  public document(): Doc {
    return this._document
  }

  public documents(): Doc[] {
    return this._documents
  }

  private getDefaultName(input: any | undefined, local: (keyof Locals & string) | (string & Record<never, never>)) {
    const defaultName = this.locals[local]
    if (isNil(defaultName)) {
      throw new TypeError(`Unexpected local key "${local}"!`)
    } else if (typeof defaultName === 'string') {
      return defaultName
    } else {
      return defaultName(input, this.pathProviderHelper)
    }
  }

  public localNameOf(
    input: any | undefined,
    target: Target,
    local: (keyof Locals & string) | (string & Record<never, never>),
  ): string {
    const generator = this.owner.resolve(target)
    if (isNil(generator)) {
      throw new Error(`"${this.owner.name()}" requested to resolve generator "${target}", which cannot be found.`)
    }
    const config = generator.globalConfiguration()
    const localNameProvider = config.localNameProvider
    if (isNil(localNameProvider)) {
      return this.getDefaultName(input, local)
    }
    return localNameProvider(input, target, local, this.pathProviderHelper) ?? this.getDefaultName(input, local)
  }

  public byUri<T>(uri: string): T {
    return this.data.uriToObject.get(uri)
  }

  public dereference<T>(input: string | ReferenceObject | T, deep?: boolean): T {
    if (typeof input === 'string') {
      return deep ? this.dereference(this.data.uriToObject.get(input)) : this.data.uriToObject.get(input)
    } else if (isReferenceObject(input)) {
      return deep ? this.dereference(this.data.uriToObject.get(input.$ref)) : this.data.uriToObject.get(input.$ref)
    }
    return input
  }

  public nameOf(input: any, target?: Target): string {
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

  public pathOf(input: any, target: Target): string {
    const path = this.config.pathProvider(input, target, this.pathProviderHelper)
    if (isNil(path)) {
      throw new TypeError(`Path provider returned ${path} for "${target}" with input ${JSON.stringify(input)}`)
    }
    return path
  }

  public uriOf(input: any): string {
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

  public hashOf(input: any): number {
    const hash = this.data.objectToHash.get(input)
    if (isNil(hash)) {
      throw new Error(
        `Input ${JSON.stringify(
          input,
        )} doesn't have a valid hash. This means it's either not part of an OpenAPI document, or you found a bug in the reader.`,
      )
    }
    return hash
  }

  public dependenciesOf<T>(fromPath: string, input: any, target: Target): T[] {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    throw this.wrongTargetError(target, 'dependencies')
  }

  public referenceOf<T>(input: any, target: Target): T {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    throw this.wrongTargetError(target, 'reference')
  }

  public configurationOf<T>(target: Target): T {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.configuration() as T
      }
    }
    throw this.wrongTargetError(target, 'configuration')
  }

  public exportOf(packageName: string, exportName: string): string {
    const { importReplacer } = this.owner.globalConfiguration()
    return isNil(importReplacer) ? exportName : importReplacer(packageName, exportName) ?? exportName
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
