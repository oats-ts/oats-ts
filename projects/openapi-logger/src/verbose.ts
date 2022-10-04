import {
  Logger,
  OatsEventEmitter,
  RuntimeDependency,
  SimpleGeneratorResult,
  CompositeGeneratorResult,
  isSimpleGeneratorResult,
  toSimpleGeneratorResult,
} from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { GeneratedFile } from '@oats-ts/typescript-writer'
import { isFailure, isSuccess } from '@oats-ts/try'
import { isOk } from '@oats-ts/validators'
import { entries } from 'lodash'
import { SourceFile } from 'typescript'
import { blue } from 'chalk'
import { Icons, issueToString, statusText, Tab } from './utils'

function printReadOutput(documents: Map<string, OpenAPIObject>): void {
  const data = Array.from(documents.entries())
  for (const [path] of data) {
    console.log(`${Tab}${Icons.s} file "${blue(path)}" read`)
  }
}

function printStructuredGeneratorResultLeaf(
  name: string,
  leaf: SimpleGeneratorResult<SourceFile>,
  printIssues: boolean,
  indentation: number,
): void {
  const { data, issues } = leaf
  const ok = isSuccess(data)
  const icon = ok ? Icons.s : Icons.x
  const length = isSuccess(data) ? data.data.length : -1
  console.log(
    `${Tab.repeat(indentation)}${icon} generator "${blue(name)}" ${ok ? 'completed' : 'failed'}${
      ok ? ` (${blue(length)} output(s))` : ''
    }`,
  )
  const allIssues = [...(isFailure(data) ? data.issues : []), ...issues]
  if (printIssues) {
    allIssues.forEach((issue) => console.log(issueToString(issue, indentation + 1)))
  }
}

function printStructuredGeneratorResult(structured: CompositeGeneratorResult<SourceFile>, indentation: number): void {
  const data = entries(structured)
  for (const [name, tryOrTree] of data) {
    if (isSimpleGeneratorResult(tryOrTree)) {
      printStructuredGeneratorResultLeaf(name, tryOrTree, true, indentation)
    } else {
      printStructuredGeneratorResultLeaf(name, toSimpleGeneratorResult(tryOrTree), false, indentation)
      printStructuredGeneratorResult(tryOrTree, indentation + 1)
    }
  }
}

function printRuntimeDependencies(deps: RuntimeDependency[]): void {
  if (deps.length === 0) {
    return
  }
  console.log(`${Tab}${Icons.i} some outputs have runtime dependencies:`)
  console.log(`${Tab}  npm i \\`)
  const sortedDeps = Array.from(deps)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, version }) => `${name}@${version}`)
  const depsText = sortedDeps.map((dep) => `${Tab}${Tab}${Tab}${blue(dep)}`).join(' \\\n')
  console.log(depsText)
}

export const verbose =
  (): Logger =>
  (emitter: OatsEventEmitter<OpenAPIObject, OpenAPIReadOutput, SourceFile, GeneratedFile>): void => {
    emitter.addListener('read-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('reader', 'completed', e.name))
        printReadOutput(e.data.data.documents)
      } else {
        console.log(statusText('reader', 'failed', e.name))
        e.data.issues.forEach((issue) => console.log(issueToString(issue)))
      }
    })

    emitter.addListener('validator-step-completed', (e) => {
      console.log(statusText('validator', isOk(e.issues) ? 'completed' : 'failed', e.name))
      e.issues.forEach((issue) => console.log(issueToString(issue)))
    })

    emitter.addListener('generator-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('generator', 'completed', e.name))
        printStructuredGeneratorResult(e.structure, 1)
        printRuntimeDependencies(e.dependencies)
      } else {
        console.log(statusText('generator', 'failed', e.name))
        printStructuredGeneratorResult(e.structure, 1)
      }
    })

    emitter.addListener('writer-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('writer', 'completed', e.name))
        e.data.data.forEach((file) => {
          console.log(`${Tab} ${Icons.s} writing "${blue(file.path)}" completed`)
        })
        e.issues.forEach((issue) => console.log(issueToString(issue)))
      } else {
        console.log(statusText('writer', 'failed', e.name))
        e.data.issues.forEach((issue) => console.log(issueToString(issue)))
      }
    })
  }
