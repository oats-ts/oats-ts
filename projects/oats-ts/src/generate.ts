import EventEmitter from 'eventemitter3'
import { isFailure, Try } from '@oats-ts/try'
import { OatsEventEmitter } from '@oats-ts/events'
import { GeneratorInput } from './typings'

export async function generate<P, R, G>(input: GeneratorInput<P, R, G>): Promise<Try<G[]>> {
  const { reader, generator, writer, validator, logger } = input
  const emitter: OatsEventEmitter<P, R, G> = new EventEmitter()

  // Log
  logger?.(emitter)

  // Read
  const readResult = await reader(emitter)
  if (isFailure(readResult)) {
    return readResult
  }

  // Validate
  const validatorResult = await validator?.(readResult.data, emitter)
  if (validatorResult !== undefined && isFailure(validatorResult)) {
    return validatorResult
  }

  // Generate
  const generatorResult = await generator(readResult.data, emitter)
  if (isFailure(generatorResult)) {
    return generatorResult
  }

  // Write
  return writer(generatorResult.data, emitter)
}
