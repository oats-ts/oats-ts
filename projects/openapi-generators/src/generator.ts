import { ContentGenerator } from '@oats-ts/oats'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { SourceFile } from 'typescript'
import { GeneratorEventEmitter } from '@oats-ts/events'
import { RootGeneratorConfig } from './types'
import { GroupGenerator } from './group/GroupGenerator'

const name = '@oats-ts/openapi-generators'

export const generator =
  (config: RootGeneratorConfig): ContentGenerator<OpenAPIReadOutput, SourceFile> =>
  async (input: OpenAPIReadOutput, emitter: GeneratorEventEmitter<SourceFile>) => {
    emitter.emit('generator-step-started', {
      type: 'generator-step-started',
      name,
    })

    const { name: generatorName, children, ...globalConfig } = config
    const generator = new GroupGenerator(generatorName ?? 'root', Array.isArray(children) ? children : [children])

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
      name,
      issues: [],
    })

    return result
  }
