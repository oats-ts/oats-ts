import { OatsEventEmitter } from '@oats-ts/events'
import { Logger } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isSuccess } from '@oats-ts/try'
import { isOk } from '@oats-ts/validators'
import { head, isNil } from 'lodash'
import { SourceFile } from 'typescript'
import { red, green, blue, yellow } from 'chalk'
import { Icons, issueToString, severityComparator, severityIcon, statusText, Tab } from './utils'

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
        e.issues.forEach((issue) => console.log(issueToString(issue)))
      } else {
        console.log(statusText('generator', 'failed', e.name))
        e.data.issues.forEach((issue) => console.log(issueToString(issue)))
      }
    })

    emitter.addListener('writer-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('writer', 'completed', e.name))
        e.issues.forEach((issue) => console.log(issueToString(issue)))
      } else {
        console.log(statusText('writer', 'failed', e.name))
        e.data.issues.forEach((issue) => console.log(issueToString(issue)))
      }
    })
  }
