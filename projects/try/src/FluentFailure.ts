import { Issue } from '@oats-ts/validators'
import { failure } from './failure'
import { FAILURE_SYMBOL } from './symbols'
import { Failure, Fluent } from './types'

export class FluentFailure implements Failure, Fluent<any> {
  public readonly issues: Issue[];
  [FAILURE_SYMBOL]: true = true

  public constructor(issues: Issue[]) {
    this.issues = issues
  }

  public map(): FluentFailure {
    return this
  }

  public flatMap(): FluentFailure {
    return this
  }

  public toTry(): Failure {
    return failure(...this.issues)
  }
}
