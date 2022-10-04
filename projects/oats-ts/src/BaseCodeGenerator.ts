import { nanoid } from 'nanoid'
import { failure, fromArray, isFailure, success, Try } from '@oats-ts/try'
import { GeneratorInit, RuntimeDependency } from './typings'
import { BaseGenerator } from './BaseGenerator'
import { Issue } from '@oats-ts/validators'
import { flatMap } from 'lodash'
import { SimpleGeneratorResult, simpleResult, compositeResult } from './GeneratorResult'

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

  protected getPreGenerateIssues(): Issue[] {
    return []
  }

  protected getPostGenerateIssues(data: Try<G[]>): Issue[] {
    return []
  }

  protected getIssues(item: M): Issue[] {
    return []
  }

  private async generateWithCatch(): Promise<[Try<G[]>, Issue[]]> {
    if (isFailure(this.dependencies)) {
      return [this.dependencies, []]
    }
    try {
      const itemsToGenerate = this.items.filter((model) => this.shouldGenerate(model))
      return [
        fromArray(await Promise.all(itemsToGenerate.map((model) => this.generateItemInternal(model)))),
        flatMap(itemsToGenerate, (item) => this.getIssues(item)),
      ]
    } catch (e) {
      console.error(e)
      return [
        failure({
          message: `${e}`,
          path: this.name(),
          severity: 'error',
        }),
        [],
      ]
    }
  }

  public async generate(): Promise<SimpleGeneratorResult<G>> {
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

    const preIssues = this.getPreGenerateIssues()
    const [data, itemIssues]: [Try<G[]>, Issue[]] = noEmit ? [success([]), []] : await this.generateWithCatch()
    const postIssues = this.getPostGenerateIssues(data)

    const issues = [...preIssues, ...itemIssues, ...postIssues]
    const wrappedResult = simpleResult<G>(data, issues)

    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
      dependencies: this.runtimeDependencies(),
      structure: compositeResult({ [this.name()]: wrappedResult }),
      data,
      issues,
    })

    await this.tick()

    return wrappedResult
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
  public abstract runtimeDependencies(): RuntimeDependency[]
}
