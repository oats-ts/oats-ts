import { ContentGenerator, GeneratorEventEmitter, toSimpleGeneratorResult } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { fluent, success, Try } from '@oats-ts/try'
import { mergeSourceFiles } from '@oats-ts/typescript-common'
import { SourceFile } from 'typescript'
import { OpenAPIGroupGenerator } from './group/OpenAPIGroupGenerator'
import { RootGeneratorConfig } from './types'

export class OpenAPIGenerator implements ContentGenerator<OpenAPIReadOutput, SourceFile> {
  constructor(private _config: RootGeneratorConfig) {}

  public name(): string {
    return '@oats-ts/openapi-generators'
  }

  protected config(): RootGeneratorConfig {
    return this._config
  }

  public async generate(
    input: OpenAPIReadOutput,
    emitter: GeneratorEventEmitter<SourceFile>,
  ): Promise<Try<SourceFile[]>> {
    emitter.emit('generator-step-started', {
      type: 'generator-step-started',
      name: this.name(),
    })

    const { name: generatorName, children, ...globalConfig } = this.config()
    const generator = new OpenAPIGroupGenerator(
      generatorName ?? 'root',
      Array.isArray(children) ? children : [children],
    )

    generator.initialize({
      globalConfig,
      emitter,
      input,
      dependencies: success([]),
      parent: undefined,
    })

    const structure = await generator.generate()

    const { data, issues } = toSimpleGeneratorResult<SourceFile>(structure)
    const result = fluent(data)
      .map((files) => mergeSourceFiles(files))
      .toTry()

    emitter.emit('generator-step-completed', {
      type: 'generator-step-completed',
      data: result,
      structure,
      dependencies: generator.runtimeDependencies(),
      name: this.name(),
      issues,
    })

    return result
  }
}
