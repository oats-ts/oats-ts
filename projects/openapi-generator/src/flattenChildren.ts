import { OAGen } from './types'

export function flattenChildren(children: (OAGen | OAGen[])[]): OAGen[] {
  const flatChildren: OAGen[] = []
  children.forEach((child) => (Array.isArray(child) ? flatChildren.push(...child) : flatChildren.push(child)))
  return flatChildren
}
