import { nanoid } from 'nanoid'
import { Try } from '@oats-ts/try'
import { CodeGenerator, GeneratorConfig, GeneratorInit } from './typings'
import { GeneratorEventEmitter } from '@oats-ts/events'

export abstract class BaseGenerator<R, G> implements CodeGenerator<R, G> {
  public readonly id = nanoid(6)

  protected parent?: CodeGenerator<R, G>
  protected input!: R
  protected globalConfig!: GeneratorConfig
  protected emitter!: GeneratorEventEmitter<G>
  protected dependencies: CodeGenerator<R, G>[] = []

  public initialize({ globalConfig, input, dependencies, emitter, parent }: GeneratorInit<R, G>): void {
    this.parent = parent
    this.input = input
    this.globalConfig = globalConfig
    this.emitter = emitter
    this.dependencies = dependencies ?? []
  }

  protected tick() {
    return new Promise<void>((resolve) => setTimeout(resolve, 0))
  }

  public resolve(name: string): CodeGenerator<R, G> | undefined {
    if (name === this.name()) {
      return this
    }
    for (const dep of this.dependencies) {
      const resolved = dep.resolve(name)
      if (resolved) {
        return dep
      }
    }
    return undefined
  }

  public abstract generate(): Promise<Try<G[]>>
  public abstract referenceOf<Model = any, Code = any>(input: Model): Code
  public abstract dependenciesOf<Model = any, Dep = any>(fromPath: string, input: Model): Dep[]
  public abstract name(): string
  public abstract produces(): string[]
  public abstract consumes(): string[]
  public abstract runtimeDependencies(): string[]
}
