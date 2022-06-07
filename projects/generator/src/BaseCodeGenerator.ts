import { nanoid } from 'nanoid'
import { fromArray, Try } from '@oats-ts/try'
import { CodeGenerator, GeneratorConfig, GeneratorInit } from './typings'
import { BaseGenerator } from './BaseGenerator'

export abstract class BaseCodeGenerator<R, G, M, C> extends BaseGenerator<R, G> {
  public readonly id = nanoid(6)

  protected input!: R
  protected globalConfig!: GeneratorConfig
  protected dependencies!: CodeGenerator<R, G>[]
  protected context!: C
  protected items!: M[]

  public initialize(init: GeneratorInit<R, G>): void {
    super.initialize(init)
    this.context = this.createContext()
    this.items = this.getItems()
  }

  public produces(): string[] {
    return [this.name()]
  }

  async generate(): Promise<Try<G[]>> {
    this.emitter.emit('generator-started', {
      type: 'generator-started',
      id: this.id,
      name: this.name(),
    })

    await this.tick()

    const result = fromArray(await Promise.all(this.items.map((model) => this.generateItemInternal(model))))

    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
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
  protected abstract createContext(): C
  protected abstract getItems(): M[]

  public abstract referenceOf(input: any): any
  public abstract dependenciesOf(fromPath: string, input: any): any[]
  public abstract name(): string
  public abstract consumes(): string[]
  public abstract runtimeDependencies(): string[]
}
