import { isNil, negate } from 'lodash'
import { Node, factory, SyntaxKind, addSyntheticLeadingComment } from 'typescript'
import { stringifyJSDoc } from './stringifyJSDoc'
import { Documentation } from './typings'

export function documentNode<T extends Node>(node: T, model: Documentation): T {
  if (!isNil(model.description) || !isNil(model.summary) || !model.deprecated) {
    const jsDoc = factory.createJSDocComment(
      [model.summary, model.description]
        .filter(negate(isNil))
        .map((docText) => docText.trim())
        .join('\n\n'),
      model.deprecated ? [factory.createJSDocDeprecatedTag(factory.createIdentifier('deprecated'))] : [],
    )
    return addSyntheticLeadingComment(node, SyntaxKind.MultiLineCommentTrivia, stringifyJSDoc(jsDoc), true)
  }
  return node
}
