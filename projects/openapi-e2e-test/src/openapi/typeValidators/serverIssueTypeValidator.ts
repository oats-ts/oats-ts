import { object, optional, shape, string } from '@oats-ts/validators'

export const serverIssueTypeValidator = object(shape({ message: optional(string()) }))
