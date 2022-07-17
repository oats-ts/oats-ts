import {
  ContentGenerator,
  CompositeGenerator,
  flattenStructuredGeneratorResult,
  GeneratorEventEmitter,
} from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'
import { RootGeneratorConfig } from './types'
import { fluent, success, Try } from '@oats-ts/try'
import { mergeSourceFiles } from '@oats-ts/typescript-common'

const name = '@oats-ts/openapi-generators'

export const generator =
  (config: RootGeneratorConfig): ContentGenerator<OpenAPIReadOutput, SourceFile> =>
  async (input: OpenAPIReadOutput, emitter: GeneratorEventEmitter<SourceFile>): Promise<Try<SourceFile[]>> => {
    emitter.emit('generator-step-started', {
      type: 'generator-step-started',
      name,
    })

    const { name: generatorName, children, ...globalConfig } = config
    const generator = new CompositeGenerator(generatorName ?? 'root', Array.isArray(children) ? children : [children])

    generator.initialize({
      globalConfig,
      emitter,
      input,
      dependencies: success([]),
      parent: undefined,
    })

    const structure = await generator.generate()

    const result = fluent(flattenStructuredGeneratorResult<SourceFile>(structure))
      .map((files) => mergeSourceFiles(files))
      .toTry()

    emitter.emit('generator-step-completed', {
      type: 'generator-step-completed',
      data: result,
      structure,
      dependencies: generator.runtimeDependencies(),
      name,
      issues: [],
    })

    return result
  }
