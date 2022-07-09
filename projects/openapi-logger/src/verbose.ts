import { flattenStructuredGeneratorResult, Logger, OatsEventEmitter, StructuredGeneratorResult } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isFailure, isSuccess, isTry, Try } from '@oats-ts/try'
import { isOk } from '@oats-ts/validators'
import { entries, head, isNil } from 'lodash'
import { SourceFile } from 'typescript'
import { blue } from 'chalk'
import { Icons, issueToString, severityComparator, severityIcon, statusText, Tab } from './utils'

function printStructuredGeneratorResultLeaf(
  name: string,
  leaf: Try<SourceFile[]>,
  printIssues: boolean,
  indentation: number,
): void {
  const ok = isSuccess(leaf)
  const icon = ok ? Icons.s : Icons.x
  const length = isSuccess(leaf) ? leaf.data.length : -1
  console.log(
    `${Tab.repeat(indentation)}${icon} generator "${blue(name)}" ${ok ? 'completed' : 'failed'}${
      ok ? ` (${blue(length)} output(s))` : ''
    }`,
  )
  if (isFailure(leaf) && printIssues) {
    leaf.issues.forEach((issue) => console.log(issueToString(issue), indentation + 1))
  }
}

function printStructuredGeneratorResult(structured: StructuredGeneratorResult<SourceFile>, indentation: number): void {
  const data = entries(structured)
  for (const [name, tryOrTree] of data) {
    if (isTry(tryOrTree)) {
      printStructuredGeneratorResultLeaf(name, tryOrTree, true, indentation)
    } else {
      printStructuredGeneratorResultLeaf(name, flattenStructuredGeneratorResult(tryOrTree), false, indentation)
      printStructuredGeneratorResult(tryOrTree, indentation + 1)
    }
  }
}

export const verbose =
  (): Logger =>
  (emitter: OatsEventEmitter<OpenAPIObject, OpenAPIReadOutput, SourceFile>): void => {
    emitter.addListener('read-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('reader', 'completed', e.name))
        const data = Array.from(e.data.data.documents.entries())
        for (const [path] of data) {
          const issues = e.issues.filter((issue) => issue.path.startsWith(path)).sort(severityComparator)
          const maxSevIssue = head(issues)
          const icon = isNil(maxSevIssue) ? Icons.s : severityIcon(maxSevIssue.severity)
          const issuesText = issues.length === 0 ? '' : ` with ${blue(issues.length)} issues`
          console.log(`${Tab.repeat(1)}${icon} file "${blue(path)}" read${issuesText}`)
          issues.forEach((issue) => console.log(issueToString(issue)))
        }
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
        printStructuredGeneratorResult(e.structured, 1)
      } else {
        console.log(statusText('generator', 'failed', e.name))
        printStructuredGeneratorResult(e.structured, 1)
      }
    })

    emitter.addListener('writer-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('writer', 'completed', e.name))
        e.data.data.forEach((file) => {
          console.log(`${Tab} ${Icons.s} writing "${blue(file.fileName)}" completed`)
        })
        e.issues.forEach((issue) => console.log(issueToString(issue)))
      } else {
        console.log(statusText('writer', 'failed', e.name))
        e.data.issues.forEach((issue) => console.log(issueToString(issue)))
      }
    })
  }
