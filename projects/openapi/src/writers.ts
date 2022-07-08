import { writer } from '@oats-ts/typescript-writer'

type Writers = {
  typescript: typeof writer
}

export const writers: Writers = {
  typescript: writer,
} as const
