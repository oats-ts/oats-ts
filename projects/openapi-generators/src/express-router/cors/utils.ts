export const defaultIsMethodAllowed = () => true
export const defaultRequestHeaderFilter: (path: string, header: string) => boolean = (_, header) => header !== 'cookie'
export const defaultResponseHeaderFilter: (path: string, header: string) => boolean = (_, header) =>
  header !== 'set-cookie'
export const defaultIncludeCredentials = () => undefined
export const defaultMaxAge = () => undefined
