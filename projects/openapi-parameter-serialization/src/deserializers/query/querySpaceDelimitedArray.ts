import { queryDelimitedArray } from './queryDelmitedArray'

export const querySpaceDelimitedArray = queryDelimitedArray(encodeURIComponent(' '))
