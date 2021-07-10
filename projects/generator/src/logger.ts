import { Failure, Module } from './typings'
import { red, green, blue, yellow } from 'chalk'
import { noop } from 'lodash'
import { items, Severity } from '../../validators/lib'

export type Logger = {
  failure: (message: string, failure: Failure) => void
  readSuccess(): void
  generatorSuccess(name: string, modules: Module[]): void
  writerSuccess(modules: Module[]): void
}

export const noopLogger: Logger = {
  failure: noop,
  readSuccess: noop,
  generatorSuccess: noop,
  writerSuccess: noop,
}

const x = red('✕')
const c = green('✔')
const w = yellow('!')
const i = blue('i')

const moduleToString = (m: Module) =>
  `    ${m.path} (${blue(m.content.length)} elements, ${blue(m.dependencies.length)} dependencies)`

const issueIcon = (severity: Severity) => {
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

export const consoleLogger: Logger = {
  failure: (message: string, failure: Failure): void => {
    const lines = [
      `${x} ${message}:`,
      ...failure.issues.map((issue) => `    ${issueIcon(issue.severity)} ${issue.message} at "${issue.path}"`),
      '',
    ]
    console.log(lines.join('\n'))
  },
  readSuccess(): void {
    console.log(`${c} Read step successful!\n`)
  },
  generatorSuccess(name: string, modules: Module[]): void {
    const lines: string[] = [
      `${c} Generator step "${blue(name)}" succesfully generated ${blue(modules.length)} module(s):`,
      ...modules.map(moduleToString),
      '',
    ]
    console.log(lines.join('\n'))
  },
  writerSuccess(modules: Module[]): void {
    const lines: string[] = [
      `${c} Write step succesfully written ${blue(modules.length)} module(s) to disk:`,
      ...modules.map(moduleToString),
      '',
    ]
    console.log(lines.join('\n'))
  },
}
