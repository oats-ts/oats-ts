import EventEmitter from 'eventemitter3'
import { isFailure, Try } from '@oats-ts/try'
import { GeneratorInput } from './typings'
import { OatsEventEmitter } from './events'

export async function generate<P, R, G, O>(input: GeneratorInput<P, R, G, O>): Promise<Try<O[]>> {
  const { reader, generator, writer, validator, logger } = input
  const emitter: OatsEventEmitter<P, R, G, O> = new EventEmitter()

  // Log
  logger?.(emitter)

  // Read
  const readResult = await reader.read(emitter)
  if (isFailure(readResult)) {
    return readResult
  }

  // Validate
  const validatorResult = await validator?.validate?.(readResult.data, emitter)
  if (validatorResult !== undefined && isFailure(validatorResult)) {
    return validatorResult
  }

  // Generate
  const generatorResult = await generator.generate(readResult.data, emitter)
  if (isFailure(generatorResult)) {
    return generatorResult
  }

  // Write
  return writer.write(generatorResult.data, emitter)
}
