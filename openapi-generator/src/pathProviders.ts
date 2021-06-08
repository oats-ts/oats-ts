import { resolve } from 'path'

export const singleFile = (path: string) => () => resolve(path)
