import { isEmpty, negate } from 'lodash'
import { Node, factory, SyntaxKind, addSyntheticLeadingComment } from 'typescript'
import { stringifyJSDoc } from './stringifyJSDoc'
import { Documentation } from './typings'

export function documentNode<T extends Node>(node: T, model: Documentation): T {
  if (isEmpty(model.summary) && isEmpty(model.description) && !Boolean(model.deprecated)) {
    return node
  }
  const jsDoc = factory.createJSDocComment(
    [model.summary, model.description]
      .filter(negate(isEmpty))
      .map((docText) => docText.trim())
      .join('\n\n'),
    model.deprecated ? [factory.createJSDocUnknownTag(factory.createIdentifier('deprecated'))] : [],
  )
  return addSyntheticLeadingComment(node, SyntaxKind.MultiLineCommentTrivia, stringifyJSDoc(jsDoc), true)
}
