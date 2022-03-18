import { Issue, FullValidator } from '../typings'

export const any = (): FullValidator<any> => (): Issue[] => []
