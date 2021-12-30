import { Issue } from '@oats-ts/validators'
import { Failure, FluentTryInterface, Try } from './types'

export class FluentFailure implements Failure, FluentTryInterface<never> {
  public readonly issues: Issue<string>[]

  constructor(issues: Issue<string>[]) {
    this.issues = issues
  }

  isSuccess(): boolean {
    return false
  }

  isFailure(): boolean {
    return true
  }

  map(): FluentFailure {
    return this
  }

  flatMap(): FluentFailure {
    return this
  }

  getData(): never {
    throw new TypeError(`Can't call ${FluentFailure.prototype.getData.name} on ${FluentFailure.name}`)
  }

  getIssues(): Issue[] {
    return this.issues
  }

  getPlain(): Try<never> {
    return { issues: this.getIssues() }
  }
}
