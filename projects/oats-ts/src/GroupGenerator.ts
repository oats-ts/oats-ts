import { flatMap, isNil, uniqBy } from 'lodash'
import { CodeGenerator, GeneratorConfig, GeneratorContext, RuntimeDependency } from './typings'
import { Try, success, failure } from '@oats-ts/try'
import { BaseGenerator } from './BaseGenerator'
import { toSimpleGeneratorResult } from './toSimpleGeneratorResult'
import { CompositeGeneratorResult, compositeResult } from './GeneratorResult'

export abstract class GroupGenerator<R, G, Ctx extends GeneratorContext> extends BaseGenerator<R, G, {}, Ctx> {
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

  public name(): string {
    return this._name
  }

  public produces(): string[] {
    return flatMap(this.children, (child) => child.produces())
  }

  public consumes(): string[] {
    return flatMap(this.children, (child) => child.consumes())
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return uniqBy(
      flatMap(this.children, (child) => child.runtimeDependencies()),
      ({ name, version }) => `${name}@${version}`,
    )
  }

  public referenceOf(input: any): never {
    throw new Error(`Can't call referenceOf on this generator`)
  }

  public dependenciesOf(fromPath: string, input: any): never {
    throw new Error(`Can't call dependenciesOf on this generator`)
  }

  public resolve(name: string): CodeGenerator<R, G> | undefined {
    const superResolved = super.resolve(name)
    if (!isNil(superResolved)) {
      return superResolved
    }
    for (const child of this.children) {
      const resolved = child.resolve(name)
      if (!isNil(resolved)) {
        return resolved
      }
    }
    return undefined
  }

  protected getChildDependencies(child: CodeGenerator<R, G>): Try<CodeGenerator<R, G>[]> {
    const mapping: Record<string, CodeGenerator<R, G> | undefined> = {}
    const depNames = child.consumes()
    for (const depName of depNames) {
      const resolved = this.resolve(depName)
      mapping[depName] = resolved
    }
    const unresolved = depNames.filter((depName) => mapping[depName] === undefined)
    if (unresolved.length > 0) {
      const unresolvedNames = unresolved.map((name) => `"${name}"`).join(', ')
      return failure({
        message: `missing dependencies: ${unresolvedNames}`,
        path: child.name(),
        severity: 'error',
      })
    }
    return success(Object.values(mapping) as CodeGenerator<R, G>[])
  }

  protected async generateChild(child: CodeGenerator<R, G>, results: CompositeGeneratorResult<G>): Promise<void> {
    const dependencies = this.getChildDependencies(child)

    child.initialize({
      parent: this,
      globalConfig: this.globalConfig,
      dependencies: dependencies,
      emitter: this.emitter,
      input: this.input,
    })

    const childResult = await child.generate()

    results[child.name()] = childResult

    return this.tick()
  }

  public async generate(): Promise<CompositeGeneratorResult<G>> {
    this.emitter.emit('generator-started', {
      type: 'generator-started',
      id: this.id,
      name: this.name(),
    })

    await this.tick()

    const childResults: CompositeGeneratorResult<G> = compositeResult({})

    if (!this.globalConfig.noEmit) {
      await Promise.all(this.children.map((child) => this.generateChild(child, childResults)))
    }

    const { data, issues } = toSimpleGeneratorResult(childResults)
    this.emitter.emit('generator-completed', {
      type: 'generator-completed',
      id: this.id,
      name: this.name(),
      data,
      structure: childResults,
      dependencies: this.runtimeDependencies(),
      issues,
    })

    await this.tick()

    return childResults
  }
}
