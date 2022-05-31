import chalk from 'chalk'
import { TextColors } from './typings'

const identity = (input: string) => input

export const noopTextColors: TextColors = {
  red: identity,
  green: identity,
  blue: identity,
  yellow: identity,
}
