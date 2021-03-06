import { nanoid } from 'nanoid'
import { CodeGenerator, GeneratorConfig, GeneratorInit, StructuredGeneratorResult } from './typings'
import { GeneratorEventEmitter } from './events'
import { isSuccess, Try } from '@oats-ts/try'

const emptyConfig: Partial<GeneratorConfig> = {
  noEmit: false,
  nameProvider: undefined,
  pathProvider: undefined,
}

export abstract class BaseGenerator<R, G, C> implements CodeGenerator<R, G> {
  public readonly id = nanoid(6)

  protected parent?: CodeGenerator<R, G>
  protected input!: R
  protected globalConfig!: GeneratorConfig
  protected emitter!: GeneratorEventEmitter<G>
  protected dependencies!: Try<CodeGenerator<R, G>[]>
  protected readonly config: C
  private readonly globalConfigOverride: Partial<GeneratorConfig>

  constructor(config: C & Partial<GeneratorConfig>) {
    const { nameProvider, pathProvider, ...cfg } = config ?? emptyConfig
    this.globalConfigOverride = {
      ...(nameProvider ? { nameProvider } : {}),
      ...(pathProvider ? { pathProvider } : {}),
    }
    this.config = cfg as C
  }

  public initialize({ globalConfig, input, dependencies, emitter, parent }: GeneratorInit<R, G>): void {
    this.parent = parent
    this.input = input
    this.globalConfig = { ...globalConfig, ...this.globalConfigOverride }
    this.emitter = emitter
    this.dependencies = dependencies
  }

  protected tick() {
    return new Promise<void>((resolve) => setTimeout(resolve, 0))
  }

  public resolve(name: string): CodeGenerator<R, G> | undefined {
    if (name === this.name()) {
      return this
    }
    if (isSuccess(this.dependencies)) {
      for (const dep of this.dependencies.data) {
        const resolved = dep.resolve(name)
        if (resolved) {
          return dep
        }
      }
    }
    return undefined
  }

  public abstract generate(): Promise<StructuredGeneratorResult<G> | Try<G[]>>
  public abstract referenceOf<Model = any, Code = any>(input: Model): Code
  public abstract dependenciesOf<Model = any, Dep = any>(fromPath: string, input: Model): Dep[]
  public abstract name(): string
  public abstract produces(): string[]
  public abstract consumes(): string[]
  public abstract runtimeDependencies(): string[]
}
