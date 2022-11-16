import {
  CompositeGeneratorResult,
  GeneratorStepCompleted,
  isSimpleGeneratorResult,
  ReadStepCompleted,
  SimpleGeneratorResult,
  toSimpleGeneratorResult,
  ValidatorStepCompleted,
  WriterStepCompleted,
} from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { isFailure, isSuccess } from '@oats-ts/try'
import { isOk } from '@oats-ts/validators'
import { blue } from 'chalk'
import { entries } from 'lodash'
import { SourceFile } from 'typescript'
import { AbstractLoggerPlugin } from './AbstractLoggerPlugin'

export class VerboseLoggerPlugin extends AbstractLoggerPlugin {
  public override name(): string {
    return `${super.name()}/${VerboseLoggerPlugin.name}`
  }

  protected printReadOutput(documents: Map<string, OpenAPIObject>): void {
    const data = Array.from(documents.entries())
    for (const [path] of data) {
      console.log(`${this.tab()}${this.successIcon()} file "${blue(path)}" read`)
    }
  }

  protected printStructuredGeneratorResultLeaf(
    name: string,
    leaf: SimpleGeneratorResult<SourceFile>,
    printIssues: boolean,
    indentation: number,
  ): void {
    const { data, issues } = leaf
    const ok = isSuccess(data)
    const icon = ok ? this.successIcon() : this.errorIcon()
    const length = isSuccess(data) ? data.data.length : -1
    console.log(
      `${this.tab().repeat(indentation)}${icon} generator "${blue(name)}" ${ok ? 'completed' : 'failed'}${
        ok ? ` (${blue(length)} output(s))` : ''
      }`,
    )
    const allIssues = [...(isFailure(data) ? data.issues : []), ...issues]
    if (printIssues) {
      allIssues.forEach((issue) => console.log(this.issueToString(issue, indentation + 1)))
    }
  }

  protected printStructuredGeneratorResult(
    structured: CompositeGeneratorResult<SourceFile>,
    indentation: number,
  ): void {
    const data = entries(structured)
    for (const [name, tryOrTree] of data) {
      if (isSimpleGeneratorResult(tryOrTree)) {
        this.printStructuredGeneratorResultLeaf(name, tryOrTree, true, indentation)
      } else {
        this.printStructuredGeneratorResultLeaf(name, toSimpleGeneratorResult(tryOrTree), false, indentation)
        this.printStructuredGeneratorResult(tryOrTree, indentation + 1)
      }
    }
  }

  protected onReadStepCompleted(e: ReadStepCompleted<any>): void {
    if (isSuccess(e.data)) {
      console.log(this.statusText('reader', 'completed', e.name))
      this.printReadOutput(e.data.data.documents)
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
      this.printStructuredGeneratorResult(e.structure, 1)
      this.printRuntimeDependencies(e.dependencies, 1)
    } else {
      console.log(this.statusText('generator', 'failed', e.name))
      this.printStructuredGeneratorResult(e.structure, 1)
    }
  }

  protected onWriterStepCompleted(e: WriterStepCompleted<any>): void {
    if (isSuccess(e.data)) {
      console.log(this.statusText('writer', 'completed', e.name))
      e.data.data.forEach((file) => {
        console.log(`${this.tab()} ${this.successIcon()} writing "${blue(file.path)}" completed`)
      })
      e.issues.forEach((issue) => console.log(this.issueToString(issue)))
    } else {
      console.log(this.statusText('writer', 'failed', e.name))
      e.data.issues.forEach((issue) => console.log(this.issueToString(issue)))
    }
  }
}
