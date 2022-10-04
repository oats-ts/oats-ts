import { Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { isNil } from 'lodash'

export const STRUCTURED_GENERATOR_RESULT = Symbol('STRUCTURED_GENERATOR_RESULT')
export const GENERATOR_RESULT = Symbol('GENERATOR_RESULT')

export type SimpleGeneratorResult<G> = {
  [GENERATOR_RESULT]: true
  data: Try<G[]>
  issues: Issue[]
}

export type CompositeGeneratorResult<G> = {
  [STRUCTURED_GENERATOR_RESULT]: true
  [key: string]: GeneratorResult<G>
}

export type GeneratorResult<G> = CompositeGeneratorResult<G> | SimpleGeneratorResult<G>

export function simpleResult<G>(data: Try<G[]>, issues: Issue[] = []): SimpleGeneratorResult<G> {
  return { [GENERATOR_RESULT]: true, data, issues }
}

export function compositeResult<G>(data: { [key: string]: GeneratorResult<G> }): CompositeGeneratorResult<G> {
  return { [STRUCTURED_GENERATOR_RESULT]: true, ...data }
}

export function isSimpleGeneratorResult<G>(input: GeneratorResult<G>): input is SimpleGeneratorResult<G> {
  return !isNil(input) && (input as SimpleGeneratorResult<G>)[GENERATOR_RESULT] === true
}

export function isCompositeGeneratorResult<G>(input: GeneratorResult<G>): input is CompositeGeneratorResult<G> {
  return !isNil(input) && (input as CompositeGeneratorResult<G>)[STRUCTURED_GENERATOR_RESULT] === true
}
