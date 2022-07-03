import { OatsEventEmitter } from '@oats-ts/events'
import { Logger } from '@oats-ts/oats'
import { isSuccess } from '@oats-ts/try'
import { isOk, Issue, Severity } from '@oats-ts/validators'
import { red, green, blue, yellow } from 'chalk'

const x = red('✕')
const s = green('✔')
const w = yellow('!')
const i = blue('i')

const severityIcon = (severity: Severity) => {
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

const issueToString = (issue: Issue) => `    ${severityIcon(issue.severity)} ${issue.message} at "${issue.path}"`

export const logger = (): Logger => (emitter: OatsEventEmitter) => {
  emitter.addListener('read-step-completed', (e) => {
    if (isSuccess(e.data)) {
      console.log(`${s} read step using "${blue(e.name)}" completed`)
      e.issues.forEach((issue) => console.log(issueToString(issue)))
    } else {
      console.log(`${x} read step using "${blue(e.name)}" failed`)
      e.data.issues.forEach((issue) => console.log(issueToString(issue)))
    }
  })

  emitter.addListener('validator-step-completed', (e) => {
    console.log(
      `${isOk(e.issues) ? s : x} validator step using "${blue(e.name)}" ${isOk(e.issues) ? 'completed' : 'failed'}`,
    )
    e.issues.forEach((issue) => console.log(issueToString(issue)))
  })

  emitter.addListener('generator-step-completed', (e) => {
    if (isSuccess(e.data)) {
      console.log(`${s} generator step using "${blue(e.name)}" completed`)
      e.issues.forEach((issue) => console.log(issueToString(issue)))
    } else {
      console.log(`${x} generator step using "${blue(e.name)}" failed`)
      e.data.issues.forEach((issue) => console.log(issueToString(issue)))
    }
  })

  emitter.addListener('writer-step-completed', (e) => {
    if (isSuccess(e.data)) {
      console.log(`${s} write step using "${blue(e.name)}" completed`)
      e.issues.forEach((issue) => console.log(issueToString(issue)))
    } else {
      console.log(`${x} write step using "${blue(e.name)}" failed`)
      e.data.issues.forEach((issue) => console.log(issueToString(issue)))
    }
  })
}
