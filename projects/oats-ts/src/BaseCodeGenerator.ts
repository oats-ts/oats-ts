import { nanoid } from 'nanoid'
import { failure, fromArray, success, Try } from '@oats-ts/try'
import { CodeGenerator, GeneratorConfig, GeneratorInit, StructuredGeneratorResult } from './typings'
import { BaseGenerator } from './BaseGenerator'
import { IssueTypes } from '@oats-ts/validators'

export abstract class BaseCodeGenerator<R, G, Cfg, M, Ctx> extends BaseGenerator<R, G, Cfg> {
  public readonly id = nanoid(6)

  protected input!: R
  protected globalConfig!: GeneratorConfig
  protected dependencies!: CodeGenerator<R, G>[]
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
    try {
      return fromArray(
        await Promise.all(
          this.items.filter((model) => this.shouldGenerate(model)).map((model) => this.generateItemInternal(model)),
        ),
      )
    } catch (e) {
      return failure([
        {
          message: `${e}`,
          path: this.name(),
          severity: 'error',
          type: IssueTypes.other,
        },
      ])
    }
  }

  async generate(): Promise<StructuredGeneratorResult<G>> {
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
    const structured: StructuredGeneratorResult<G> = { [this.name()]: result }

    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
      structured,
      data: result,
      issues: [],
    })

    await this.tick()

    return structured
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
