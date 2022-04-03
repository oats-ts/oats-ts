import { Issue, stringify } from '@oats-ts/validators'
import { Failure, Fluent } from './types'

export class FluentFailure implements Failure, Fluent<any> {
  public readonly issues: Issue[]

  public constructor(issues: Issue[]) {
    this.issues = issues
  }

  public get<S, F>(_: (input: never) => S, mapFailure: (input: Issue[]) => F): F {
    if (typeof mapFailure !== 'function') {
      throw new TypeError(
        `Can't call ${FluentFailure.prototype.get.name} on ${FluentFailure.name}\n${this.issues.map(stringify)}`,
      )
    }
    return mapFailure(this.issues)
  }

  public map(): FluentFailure {
    return this
  }

  public flatMap(): FluentFailure {
    return this
  }

  public toTry(): Failure {
    return { issues: this.issues }
  }
}
