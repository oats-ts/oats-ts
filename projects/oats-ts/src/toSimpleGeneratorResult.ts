import { fluent, fromArray, Try } from '@oats-ts/try'
import { Issue } from '@oats-ts/validators'
import { flatMap, values } from 'lodash'
import {
  isSimpleGeneratorResult,
  CompositeGeneratorResult,
  SimpleGeneratorResult,
  simpleResult,
} from './GeneratorResult'

function flattenInternal<G>(structured: CompositeGeneratorResult<G>, tries: Try<G[]>[]): Try<G[]>[] {
  const data = values(structured)
  for (const resOrStr of data) {
    if (isSimpleGeneratorResult(resOrStr)) {
      tries.push(resOrStr.data)
    } else {
      flattenInternal(resOrStr, tries)
    }
  }
  return tries
}

function flattenIssues(structured: CompositeGeneratorResult<any>, issues: Issue[]): Issue[] {
  const data = values(structured)
  for (const resOrStr of data) {
    if (isSimpleGeneratorResult(resOrStr)) {
      issues.push(...resOrStr.issues)
    } else {
      flattenIssues(resOrStr, issues)
    }
  }
  return issues
}

export function toSimpleGeneratorResult<G>(structured: CompositeGeneratorResult<G>): SimpleGeneratorResult<G> {
  return simpleResult(
    fluent(fromArray(flattenInternal(structured, []))).map((data) => flatMap(data, (items) => items)),
    flattenIssues(structured, []),
  )
}
