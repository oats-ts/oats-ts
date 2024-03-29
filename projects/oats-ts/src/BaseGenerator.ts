import { nanoid } from 'nanoid'
import { CodeGenerator, GeneratorConfig, GeneratorContext, GeneratorInit, RuntimeDependency } from './typings'
import { GeneratorEventEmitter } from './events'
import { isSuccess, Try } from '@oats-ts/try'
import { isNil } from 'lodash'
import { GeneratorResult } from './GeneratorResult'

const emptyConfig: Partial<GeneratorConfig> = {
  noEmit: false,
  nameProvider: undefined,
  pathProvider: undefined,
}

export abstract class BaseGenerator<R, G, C, Ctx extends GeneratorContext = GeneratorContext>
  implements CodeGenerator<R, G, C, Ctx>
{
  public readonly id = nanoid(6)

  protected _parent?: CodeGenerator<R, G>
  protected input!: R
  protected globalConfig!: GeneratorConfig
  protected emitter!: GeneratorEventEmitter<G>
  protected dependencies!: Try<CodeGenerator<R, G>[]>
  private readonly config: C
  private readonly globalConfigOverride: Partial<GeneratorConfig>

  public constructor(config: C & Partial<GeneratorConfig>) {
    const { nameProvider, pathProvider, importReplacer, localNameProvider, noEmit, ...cfg } = config ?? emptyConfig
    this.globalConfigOverride = {
      ...(nameProvider ? { nameProvider } : {}),
      ...(pathProvider ? { pathProvider } : {}),
      ...(importReplacer ? { importReplacer } : {}),
      ...(localNameProvider ? { localNameProvider } : {}),
      noEmit: Boolean(noEmit),
    }
    this.config = cfg as C
  }

  public globalConfiguration(): GeneratorConfig {
    return this.globalConfig ?? ({} as GeneratorConfig)
  }

  public parent(): CodeGenerator<R, G, any> | undefined {
    return this._parent
  }

  public root(): CodeGenerator<R, G, any> {
    const parent = this.parent()
    if (isNil(parent)) {
      return this
    }
    return parent.root()
  }

  public initialize(init: GeneratorInit<R, G>): void {
    const { globalConfig, input, dependencies, emitter, parent } = init
    this._parent = parent
    this.input = input
    this.globalConfig = { ...globalConfig, ...this.globalConfigOverride }
    this.emitter = emitter
    this.dependencies = dependencies
  }

  protected tick() {
    return new Promise<void>((resolve) => setTimeout(resolve, 0))
  }

  public configuration(): C {
    return this.config
  }

  public resolve(name: string): CodeGenerator<R, G> | undefined {
    if (name === this.name()) {
      return this
    }
    if (isSuccess(this.dependencies)) {
      for (const dep of this.dependencies.data) {
        const resolved = dep.resolve(name)
        if (!isNil(resolved)) {
          return resolved
        }
      }
    }
    return undefined
  }

  public abstract generate(): Promise<GeneratorResult<G>>
  public abstract referenceOf<Model = any, Code = any>(input: Model): Code
  public abstract dependenciesOf<Model = any, Dep = any>(fromPath: string, input: Model): Dep[]
  public abstract name(): string
  public abstract produces(): string[]
  public abstract consumes(): string[]
  public abstract context(): Ctx
  public abstract runtimeDependencies(): RuntimeDependency[]
}
