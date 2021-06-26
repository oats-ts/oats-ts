import { Failure, Module } from './typings'
import { red, green, blue } from 'chalk'
import { noop } from 'lodash'

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
const c = green(`✔`)

const moduleToString = (m: Module) =>
  `    ${m.path} (${blue(m.content.length)} elements, ${blue(m.dependencies.length)} dependencies)`

export const consoleLogger: Logger = {
  failure: (message: string, failure: Failure): void => {
    const lines = [
      `${x} ${message}:`,
      ...failure.issues.map((issue) => `    ${x} ${issue.message} at "${issue.path}"`),
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
