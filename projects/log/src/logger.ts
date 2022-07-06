import { OatsEventEmitter } from '@oats-ts/events'
import { Logger } from '@oats-ts/oats-ts'
import { isSuccess } from '@oats-ts/try'
import { isOk, Issue, Severity } from '@oats-ts/validators'
import { red, green, blue, yellow } from 'chalk'

const x = red('✕')
const s = green('✔')
const w = yellow('!')
const i = blue('i')

function severityIcon(severity: Severity): string {
  switch (severity) {
    case 'warning':
      return w
    case 'info':
      return i
    case 'error':
      return x
    default:
      return '?'
  }
}

function issueToString(issue: Issue): string {
  return `    ${severityIcon(issue.severity)} ${issue.message} at "${issue.path}"`
}

function statusText(step: string, status: 'completed' | 'failed', name: string): string {
  return `${status === 'completed' ? s : x} ${step} step ${status} using "${blue(name)}"`
}

export const logger =
  (): Logger =>
  (emitter: OatsEventEmitter): void => {
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
