import { ContentGenerator } from '@oats-ts/oats'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'
import { GeneratorEventEmitter } from '@oats-ts/events'
import { OpenAPIGenerator, RootGeneratorConfig } from './types'
import { GroupGenerator } from './group/GroupGenerator'
import { flattenChildren } from './utils/flattenChildren'

export const generator =
  (config: RootGeneratorConfig) =>
  (...children: (OpenAPIGenerator | OpenAPIGenerator[])[]): ContentGenerator<OpenAPIReadOutput, SourceFile> =>
  async (input: OpenAPIReadOutput, emitter: GeneratorEventEmitter<SourceFile>) => {
    emitter.emit('generator-step-started', {
      type: 'generator-step-started',
    })

    const { name, ...globalConfig } = config
    const generator = new GroupGenerator(name ?? 'root', flattenChildren(children))

    generator.initialize({
      globalConfig,
      emitter,
      input,
      dependencies: [],
      parent: undefined,
    })

    const result = await generator.generate()

    emitter.emit('generator-step-completed', {
      type: 'generator-step-completed',
      data: result,
      issues: [],
    })

    return result
  }