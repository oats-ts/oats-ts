import { flatMap } from 'lodash'
import { CodeGenerator, GeneratorConfig, GeneratorInit } from './typings'
import { Try, fromArray, fluent, isFailure, success, isSuccess, failure } from '@oats-ts/try'
import { BaseGenerator } from './BaseGenerator'
import { IssueTypes } from '@oats-ts/validators'

export abstract class CompositeGenerator<R, G> extends BaseGenerator<R, G> {
  public name(): string {
    return this._name
  }
  private readonly _name: string

  public children: ReadonlyArray<CodeGenerator<R, G>>

  public constructor(
    name: string,
    children: CodeGenerator<R, G>[],
    globalConfigOverride: Partial<GeneratorConfig> = {},
  ) {
    super(globalConfigOverride)
    this._name = name
    this.children = children
  }

  public produces(): string[] {
    return flatMap(this.children, (child) => child.produces())
  }

  public consumes(): string[] {
    return flatMap(this.children, (child) => child.consumes())
  }

  public runtimeDependencies(): string[] {
    return flatMap(this.children, (child) => child.runtimeDependencies())
  }

  public referenceOf(input: any): any {
    return undefined
  }

  public dependenciesOf(fromPath: string, input: any): any {
    return undefined
  }

  public resolve(name: string): CodeGenerator<R, G> | undefined {
    const superResolved = super.resolve(name)
    if (superResolved) {
      return superResolved
    }
    for (const child of this.children) {
      const resolved = child.resolve(name)
      if (resolved) {
        return resolved
      }
    }
    return undefined
  }

  protected getChildDependencies(child: CodeGenerator<R, G>): Try<CodeGenerator<R, G>[]> {
    const mapping: Record<string, CodeGenerator<R, G> | undefined> = {}
    const depNames = child.consumes()
    for (const depName of depNames) {
      mapping[depName] = this.resolve(depName)
    }
    const unresolved = depNames.filter((depName) => mapping[depName] === undefined)
    if (unresolved.length > 0) {
      const unresolvedNames = unresolved.map((name) => `"${name}"`).join(', ')
      return failure([
        {
          message: `Failed to resolved dependencies, missing: ${unresolvedNames}`,
          path: child.name(),
          severity: 'error',
          type: IssueTypes.other,
        },
      ])
    }
    return success(Object.values(mapping) as CodeGenerator<R, G>[])
  }

  protected async generateChild(child: CodeGenerator<R, G>, childResults: Try<G[]>[]) {
    const deps = this.getChildDependencies(child)

    if (isFailure(deps)) {
      this.emitter.emit('generator-completed', {
        type: 'generator-completed',
        id: child.id,
        name: child.name(),
        data: deps,
        issues: [],
      })
      return this.tick()
    }

    child.initialize({
      parent: this,
      globalConfig: this.globalConfig,
      dependencies: deps.data,
      emitter: this.emitter,
      input: this.input,
    })

    const childResult = await child.generate()

    childResults.push(childResult)

    await this.tick()
  }

  async generate(): Promise<Try<G[]>> {
    this.emitter.emit('generator-started', {
      type: 'generator-started',
      id: this.id,
      name: this.name(),
    })

    await this.tick()

    const childResults: Try<G[]>[] = []

    if (!this.globalConfig.noEmit) {
      await Promise.all(this.children.map((child) => this.generateChild(child, childResults)))
    }

    const output = fluent(fromArray(childResults))
      .map((result) => flatMap(result, (items) => items))
      .map((result) => this.flatten(result))
      .toTry()

    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
      data: output,
      issues: [],
    })

    await this.tick()

    return output
  }

  protected abstract flatten(output: G[]): G[]
}
