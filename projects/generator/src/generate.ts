import { isEmpty } from 'lodash'
import { ensureDependencies } from './ensureDependencies'
import { isFailure } from './isFailure'
import { consoleLogger, noopLogger } from './logger'
import { GeneratorInput, Try, Module, Failure } from './typings'

export async function generate<R, G extends Module>(input: GeneratorInput<R, G>): Promise<Try<G[]>> {
  const { reader, generators, writer, log } = input
  const logger = log ? consoleLogger : noopLogger

  const readResult = await reader()
  if (isFailure(readResult)) {
    logger.failure(`Read step failed:`, readResult)
    return readResult
  }
  logger.readSuccess()

  const depIssues = ensureDependencies(generators)
  if (!isEmpty(depIssues)) {
    const failure: Failure = { issues: depIssues }
    logger.failure(
      'Some generators have unresolved dependencies. You can fix this by adding the appropriate generator!',
      failure,
    )
    return failure
  }

  const modules: G[] = []

  for (const generator of generators) {
    generator.initialize(readResult, generators)
  }

  for (const generator of generators) {
    const result = await generator.generate()
    if (isFailure(result)) {
      logger.failure(`Generator step "${generator.id}" failed:`, result)
      return result
    }
    logger.generatorSuccess(generator.id, result)
    modules.push(...result)
  }

  const writeResult = await writer(modules)
  if (isFailure(writeResult)) {
    logger.failure(`Writer step failed:`, writeResult)
    return writeResult
  }
  logger.writerSuccess(writeResult)
  return writeResult
}
