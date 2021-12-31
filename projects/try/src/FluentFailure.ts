import { Issue } from '@oats-ts/validators'
import { Failure, Fluent } from './types'

export class FluentFailure implements Failure, Fluent<any> {
  public readonly issues: Issue<string>[]

  public constructor(issues: Issue<string>[]) {
    this.issues = issues
  }

  public get<S, F>(_: (input: never) => S, mapFailure: (input: Issue<string>[]) => F): F {
    if (typeof mapFailure !== 'function') {
      throw new TypeError(`Can't call ${FluentFailure.prototype.get.name} on ${FluentFailure.name}`)
    }
    return mapFailure(this.getIssues())
  }

  public isSuccess(): boolean {
    return false
  }

  public isFailure(): boolean {
    return true
  }

  public map(): FluentFailure {
    return this
  }

  public flatMap(): FluentFailure {
    return this
  }

  public getData(): never {
    throw new TypeError(`Can't call ${FluentFailure.prototype.getData.name} on ${FluentFailure.name}`)
  }

  public getDataOrElse(data: any): any {
    return data
  }

  public getIssues(): Issue[] {
    return this.issues
  }

  public getIssuesOrElse(): Issue<string>[] {
    return this.getIssues()
  }

  public doIfSuccess(): FluentFailure {
    return this
  }

  public doIfFailure(effect: (issues: Issue[]) => void): FluentFailure {
    effect(this.getIssues())
    return this
  }

  public getPlain(): Failure {
    return { issues: this.getIssues() }
  }
}
