import { ValidatorConfig } from '../typings'
import { append } from './append'
import { message } from './message'
import { severity } from './severity'

export const DefaultConfig: ValidatorConfig = {
  append,
  message,
  severity,
}

export const DefaultPath = '$'
