import {
  GeneratorStepCompleted,
  ReadStepCompleted,
  ValidatorStepCompleted,
  WriterStepCompleted,
} from '@oats-ts/oats-ts'
import { isSuccess } from '@oats-ts/try'
import { isOk } from '@oats-ts/validators'
import { AbstractLoggerPlugin } from './AbstractLoggerPlugin'

export class SimpleLoggerPlugin extends AbstractLoggerPlugin {
  public override name(): string {
    return `${super.name()}/${SimpleLoggerPlugin.name}`
  }

  protected onReadStepCompleted(e: ReadStepCompleted<any>): void {
    if (isSuccess(e.data)) {
      console.log(this.statusText('reader', 'completed', e.name))
      e.issues.forEach((issue) => console.log(this.issueToString(issue)))
    } else {
      console.log(this.statusText('reader', 'failed', e.name))
      e.data.issues.forEach((issue) => console.log(this.issueToString(issue)))
    }
  }

  protected onValidatorStepCompleted(e: ValidatorStepCompleted): void {
    console.log(this.statusText('validator', isOk(e.issues) ? 'completed' : 'failed', e.name))
    e.issues.forEach((issue) => console.log(this.issueToString(issue)))
  }

  protected onGeneratorStepCompleted(e: GeneratorStepCompleted<any>): void {
    if (isSuccess(e.data)) {
      console.log(this.statusText('generator', 'completed', e.name))
      e.issues.forEach((issue) => console.log(this.issueToString(issue)))
      if (e.dependencies.length > 0) {
        this.printRuntimeDependencies(e.dependencies, 0)
      }
    } else {
      console.log(this.statusText('generator', 'failed', e.name))
      e.data.issues.forEach((issue) => console.log(this.issueToString(issue)))
    }
  }

  protected onWriterStepCompleted(e: WriterStepCompleted<any>): void {
    if (isSuccess(e.data)) {
      console.log(this.statusText('writer', 'completed', e.name))
      e.issues.forEach((issue) => console.log(this.issueToString(issue)))
    } else {
      console.log(this.statusText('writer', 'failed', e.name))
      e.data.issues.forEach((issue) => console.log(this.issueToString(issue)))
    }
  }
}
