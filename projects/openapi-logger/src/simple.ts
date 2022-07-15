import { Logger, OatsEventEmitter } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isSuccess } from '@oats-ts/try'
import { GeneratedFile } from '@oats-ts/typescript-writer'
import { isOk } from '@oats-ts/validators'
import { blue } from 'chalk'
import { SourceFile } from 'typescript'
import { Icons, issueToString, statusText } from './utils'

export const simple =
  (): Logger =>
  (emitter: OatsEventEmitter<OpenAPIObject, OpenAPIReadOutput, SourceFile, GeneratedFile>): void => {
    emitter.addListener('read-step-completed', (e) => {
      if (isSuccess(e.data)) {
        console.log(statusText('reader', 'completed', e.name))
        e.issues.forEach((issue) => console.log(issueToString(issue)))
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
        if (e.dependencies.length > 0) {
          const deps = Array.from(e.dependencies)
            .sort((a, b) => a.localeCompare(b))
            .join(' ')
          console.log(`${Icons.i} npm i ${blue(deps)}`)
        }
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
