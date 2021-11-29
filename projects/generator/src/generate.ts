import { isEmpty, isNil } from 'lodash'
import { isOk } from '@oats-ts/validators'
import { ensureDependencies } from './ensureDependencies'
import { consoleLogger, noopLogger } from './logger'
import { GeneratorInput, Module, Result } from './typings'

export async function generate<R, G extends Module>(input: GeneratorInput<R, G>): Promise<Result<G[]>> {
  const { reader, generators, writer, configuration } = input
  const logger = configuration.log ? consoleLogger : noopLogger

  const readResult = await reader()
  if (!readResult.isOk) {
    logger.issues(`Read step failed`, readResult.issues)
    return { ...readResult, data: undefined }
  }
  logger.readSuccess()

  const issues = isNil(input.validator) ? [] : await input.validator(readResult.data)

  if (!isEmpty(issues)) {
    logger.issues(`Input validation finished with ${issues.length} issues`, issues)
    if (!isOk(issues)) {
      return { isOk: false, issues }
    }
  }

  const depIssues = ensureDependencies(generators)
  if (!isEmpty(depIssues)) {
    logger.issues(
      'Some generators have unresolved dependencies. You can fix this by adding the appropriate generator',
      depIssues,
    )
    return { isOk: false, issues: depIssues }
  }

  const modules: G[] = []

  for (const generator of generators) {
    generator.initialize(readResult.data, configuration, generators)
  }

  for (const generator of generators) {
    const result = await generator.generate()
    if (!result.isOk) {
      logger.issues(`Generator step "${generator.id}" failed`, result.issues)
      return result
    }
    logger.generatorSuccess(generator.id, result)
    modules.push(...result.data)
  }

  const writeResult = await writer(modules)
  if (!writeResult.isOk) {
    logger.issues(`Writer step failed`, writeResult.issues)
    return writeResult
  }
  logger.writerSuccess(writeResult.data)
  return writeResult
}
