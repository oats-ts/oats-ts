import { RuntimePackages } from '@oats-ts/openapi-common'
import { factory, ParameterDeclaration } from 'typescript'
import { RouterNames } from '../utils/RouterNames'

export function getExpressRouterHandlerParameters(): ParameterDeclaration[] {
  return [
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      RouterNames.request,
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Express.Request),
    ),
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      RouterNames.response,
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Express.Response),
    ),
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      RouterNames.next,
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Express.NextFunction),
    ),
  ]
}
