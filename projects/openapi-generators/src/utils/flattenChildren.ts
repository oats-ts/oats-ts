import { OpenAPIGenerator } from '../types'

export function flattenChildren(children: (OpenAPIGenerator | OpenAPIGenerator[])[]): OpenAPIGenerator[] {
  const flatChildren: OpenAPIGenerator[] = []
  children.forEach((child) => (Array.isArray(child) ? flatChildren.push(...child) : flatChildren.push(child)))
  return flatChildren
}
