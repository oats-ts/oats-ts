import EventEmitter from 'eventemitter3'
import { isFailure, Try } from '@oats-ts/try'
import { GeneratorInput } from './typings'
import { OatsEventEmitter } from './events'

export async function generate<P, R, G, O>(input: GeneratorInput<P, R, G, O>): Promise<Try<O[]>> {
  // Event emitter used for this generator run
  const emitter: OatsEventEmitter<P, R, G, O> = new EventEmitter()

  // Plugins consuming events
  const plugins = input.plugins ?? []

  // Setup each plugin
  plugins.forEach((plugin) => plugin.addEventListeners(emitter))

  // Read
  const readResult = await input.reader.read(emitter)
  if (isFailure(readResult)) {
    return readResult
  }

  // Validate
  const validatorResult = await input.validator?.validate?.(readResult.data, emitter)
  if (validatorResult !== undefined && isFailure(validatorResult)) {
    return validatorResult
  }

  // Generate
  const generatorResult = await input.generator.generate(readResult.data, emitter)
  if (isFailure(generatorResult)) {
    return generatorResult
  }

  // Write
  const result = await input.writer.write(generatorResult.data, emitter)

  // Teardown each plugin
  plugins.forEach((plugin) => plugin.removeEventListeners(emitter))

  return result
}
