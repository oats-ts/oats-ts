import { GeneratorInput } from './typings'
import { isFailure, Try } from '@oats-ts/try'
import { DefaultLogger } from '@oats-ts/log'

export async function generate<R, G>(input: GeneratorInput<R, G>): Promise<Try<G>> {
  const { reader, generator, writer, validator, logger = DefaultLogger.create() } = input

  // Read
  const readResult = await reader(logger)
  if (isFailure(readResult)) {
    return readResult
  }

  // Validate
  const validatorResult = await validator?.(readResult.data, logger)
  if (isFailure(validatorResult)) {
    return validatorResult
  }

  // Generate
  const generatorResult = await generator(readResult.data, logger)
  if (isFailure(generatorResult)) {
    return generatorResult
  }

  // Write
  return writer(generatorResult.data, logger)
}
