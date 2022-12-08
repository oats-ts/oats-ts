import {
  CodeGenerator,
  GeneratorConfig,
  LocalNameProviderHelper,
  NameProviderHelper,
  PathProviderHelper,
} from '@oats-ts/oats-ts'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isNil } from 'lodash'
import { isReferenceObject } from './isReferenceObject'
import { LocalNameDefaults, OpenAPIGeneratorContext, OpenAPIGeneratorTarget, ReadOutput } from './typings'
import { NameProviderHelperImpl } from './NameProviderHelperImpl'
import { PathProviderHelperImpl } from './PathProviderHelperImpl'
import { LocalNameProviderHelperImpl } from './LocalNameProviderHelperImpl'
import { OpenAPIObject } from '@oats-ts/openapi-model'

export class OpenAPIGeneratorContextImpl<Cfg extends GeneratorConfig> implements OpenAPIGeneratorContext {
  public readonly _document: OpenAPIObject
  public readonly _documents: OpenAPIObject[]
  protected readonly nameProviderHelper: NameProviderHelper
  protected readonly pathProviderHelper: PathProviderHelper
  protected readonly localNameProviderHelper: LocalNameProviderHelper

  public constructor(
    protected owner: CodeGenerator<any, any>,
    protected data: ReadOutput<OpenAPIObject>,
    readonly config: Cfg,
    readonly generators: CodeGenerator<any, any>[],
    readonly locals: LocalNameDefaults,
  ) {
    this._document = data.document
    this._documents = Array.from(data.documents.values())
    this.nameProviderHelper = new NameProviderHelperImpl(data)
    this.pathProviderHelper = new PathProviderHelperImpl(data, this.config.nameProvider, this.nameProviderHelper)
    this.localNameProviderHelper = new LocalNameProviderHelperImpl(data)
  }

  public document(): OpenAPIObject {
    return this._document
  }

  public documents(): OpenAPIObject[] {
    return this._documents
  }

  private getDefaultName(input: any | undefined, target: OpenAPIGeneratorTarget, local: string) {
    const defaultName = this.locals[local]
    if (isNil(defaultName)) {
      throw new TypeError(
        `Local "${target}"."${local}" cannot be resolved, as there is no default value for it, and localNameProvider doesn't provide this name!`,
      )
    } else if (typeof defaultName === 'string') {
      return defaultName
    } else {
      return defaultName(input, this.localNameProviderHelper)
    }
  }

  public localNameOf<L extends string>(input: any | undefined, target: OpenAPIGeneratorTarget, local: L): string {
    if (target !== this.owner.name()) {
      const generator = this.owner.resolve(target)
      if (isNil(generator)) {
        throw new Error(`"${this.owner.name()}" requested to resolve generator "${target}", which cannot be found.`)
      }
      return generator.context().localNameOf<L>(input, target, local)
    }

    const config = this.owner.globalConfiguration()
    const localNameProvider = config.localNameProvider
    const defaultName = this.getDefaultName(input, target, local)
    const providedName = localNameProvider?.(input, target, local, defaultName, this.localNameProviderHelper)
    return providedName ?? defaultName
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

  public hasName(input: any, target?: OpenAPIGeneratorTarget | undefined): boolean {
    return !isNil(
      isNil(target)
        ? this.data.objectToName.get(input)
        : this.config.nameProvider(input, target, this.nameProviderHelper),
    )
  }

  public nameOf(input: any, target?: OpenAPIGeneratorTarget): string {
    const originalName = this.data.objectToName.get(input)
    if (isNil(target)) {
      if (isNil(originalName)) {
        throw new TypeError(`Value is not named: ${JSON.stringify(input)}`)
      }
      return originalName
    }
    const name = this.config.nameProvider(input, target, this.nameProviderHelper)
    if (isNil(name)) {
      throw new TypeError(`Name provider returned ${name} for "${target}" with input ${JSON.stringify(input)}`)
    }
    return name
  }

  public pathOf(input: any, target: OpenAPIGeneratorTarget): string {
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

  public dependenciesOf<T>(fromPath: string, input: any, target: OpenAPIGeneratorTarget): T[] {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.dependenciesOf(fromPath, input) ?? []
      }
    }
    throw this.wrongTargetError(target, 'dependencies')
  }

  public referenceOf<T>(input: any, target: OpenAPIGeneratorTarget): T {
    for (const generator of this.generators) {
      if (generator.name() === target) {
        return generator.referenceOf(input)
      }
    }
    throw this.wrongTargetError(target, 'reference')
  }

  public configurationOf<T>(target: OpenAPIGeneratorTarget): T {
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

  private wrongTargetError(target: OpenAPIGeneratorTarget, requested: string): Error {
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
