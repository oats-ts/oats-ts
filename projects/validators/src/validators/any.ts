import { Issue, Validator } from '../typings'

export const any = (): Validator<any> => (): Issue[] => []
