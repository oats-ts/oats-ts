import { fluent, fromArray, isTry, Try } from '@oats-ts/try'
import { flatMap, values } from 'lodash'
import { StructuredGeneratorResult } from './typings'

function collectTries<G>(structured: StructuredGeneratorResult<G>, tries: Try<G[]>[]): Try<G[]>[] {
  const data = values(structured)
  for (const tryOrRes of data) {
    if (isTry(tryOrRes)) {
      tries.push(tryOrRes)
    } else {
      collectTries(tryOrRes, tries)
    }
  }
  return tries
}

export function flattenStructuredGeneratorResult<G>(structured: StructuredGeneratorResult<G>): Try<G[]> {
  return fluent(fromArray(collectTries(structured, []))).map((data) => flatMap(data, (items) => items))
}
