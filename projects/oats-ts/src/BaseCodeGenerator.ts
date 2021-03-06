import { nanoid } from 'nanoid'
import { failure, fromArray, isFailure, success, Try } from '@oats-ts/try'
import { GeneratorInit } from './typings'
import { BaseGenerator } from './BaseGenerator'

export abstract class BaseCodeGenerator<R, G, Cfg, M, Ctx> extends BaseGenerator<R, G, Cfg> {
  public readonly id = nanoid(6)

  protected context!: Ctx
  protected items!: M[]

  public initialize(init: GeneratorInit<R, G>): void {
    super.initialize(init)
  }

  public produces(): string[] {
    return [this.name()]
  }

  protected shouldGenerate(item: M): boolean {
    return true
  }

  private async generateWithCatch(): Promise<Try<G[]>> {
    if (isFailure(this.dependencies)) {
      return this.dependencies
    }
    try {
      return fromArray(
        await Promise.all(
          this.items.filter((model) => this.shouldGenerate(model)).map((model) => this.generateItemInternal(model)),
        ),
      )
    } catch (e) {
      return failure({
        message: `${e}`,
        path: this.name(),
        severity: 'error',
      })
    }
  }

  async generate(): Promise<Try<G[]>> {
    this.emitter.emit('generator-started', {
      type: 'generator-started',
      id: this.id,
      name: this.name(),
    })

    const { noEmit } = this.globalConfig

    if (!noEmit) {
      this.context = this.createContext()
      this.items = this.getItems()
    }

    await this.tick()

    const result = noEmit ? success([]) : await this.generateWithCatch()

    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
      dependencies: this.runtimeDependencies(),
      structure: { [this.name()]: result },
      data: result,
      issues: [],
    })

    await this.tick()

    return result
  }

  protected async generateItemInternal(model: M): Promise<Try<G>> {
    const result = await this.generateItem(model)

    this.emitter.emit('generator-progress', {
      type: 'generator-progress',
      id: this.id,
      name: this.name(),
      input: model,
      data: result,
      issues: [],
    })

    await this.tick()

    return result
  }

  protected abstract generateItem(item: M): Promise<Try<G>>
  protected abstract createContext(): Ctx
  protected abstract getItems(): M[]

  public abstract referenceOf(input: any): any
  public abstract dependenciesOf(fromPath: string, input: any): any[]
  public abstract name(): string
  public abstract consumes(): string[]
  public abstract runtimeDependencies(): string[]
}
