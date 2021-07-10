import { isEmpty } from 'lodash'
import { ensureDependencies } from './ensureDependencies'
import { consoleLogger, noopLogger } from './logger'
import { GeneratorInput, Module, Result } from './typings'

export async function generate<R, G extends Module>(input: GeneratorInput<R, G>): Promise<Result<G[]>> {
  const { reader, generators, writer, log } = input
  const logger = log ? consoleLogger : noopLogger

  const readResult = await reader()
  if (!readResult.isOk) {
    logger.failure(`Read step failed`, readResult.issues)
    return { ...readResult, data: undefined }
  }
  logger.readSuccess()

  const depIssues = ensureDependencies(generators)
  if (!isEmpty(depIssues)) {
    logger.failure(
      'Some generators have unresolved dependencies. You can fix this by adding the appropriate generator!',
      depIssues,
    )
    return { isOk: false, issues: depIssues }
  }

  const modules: G[] = []

  for (const generator of generators) {
    generator.initialize(readResult.data, generators)
  }

  for (const generator of generators) {
    const result = await generator.generate()
    if (!result.isOk) {
      logger.failure(`Generator step "${generator.id}" failed`, result.issues)
      return result
    }
    logger.generatorSuccess(generator.id, result)
    modules.push(...result.data)
  }

  const writeResult = await writer(modules)
  if (!writeResult.isOk) {
    logger.failure(`Writer step failed`, writeResult.issues)
    return writeResult
  }
  logger.writerSuccess(writeResult.data)
  return writeResult
}
