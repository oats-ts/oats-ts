import { Issue } from '@oats-ts/validators'
import { Failure, FluentTryInterface } from './types'

export class FluentFailure implements Failure, FluentTryInterface<any> {
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

  getDataOrElse(data: any): any {
    return data
  }

  getIssues(): Issue[] {
    return this.issues
  }

  getIssuesOrElse(): Issue<string>[] {
    return this.issues
  }

  doIfSuccess(): FluentFailure {
    return this
  }

  doIfFailure(effect: (issues: Issue[]) => void): FluentFailure {
    effect(this.getIssues())
    return this
  }

  getPlain(): Failure {
    return { issues: this.getIssues() }
  }
}
