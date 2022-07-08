import { queryDelimitedArray } from './queryDelimitedArray'

// TODO not factoring in allowReserved with the separator...
export const queryPipeDelimitedArray = queryDelimitedArray('|')
