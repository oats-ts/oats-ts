import { BabelModule } from '@oats-ts/babel-writer'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getOperationInputTypeAst } from './getOperationInputTypeAst'

export function generateOperationInputType(data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  const { operation } = data
  return {
    imports: [],
    path: accessor.path(operation, 'operation-input-type'),
    statements: [getOperationInputTypeAst(data, context)],
  }
}
