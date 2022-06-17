import { path } from '.'
import { createSerializerTest } from '../testUtils'
import {
  pathLabelArrayTestData,
  pathLabelObjectTestData,
  pathLabelPrimitiveTestData,
  pathMatrixArrayTestData,
  pathMatrixObjectTestData,
  pathMatrixPrimitiveTestData,
  pathSimpleArrayTestData,
  pathSimpleObjectTestData,
  pathSimplePrimitiveTestData,
} from './pathSerializers.testdata'

createSerializerTest('path.simple.primitive', pathSimplePrimitiveTestData, path.simple.primitive as any)
createSerializerTest('path.simple.array', pathSimpleArrayTestData, path.simple.array as any)
createSerializerTest('path.simple.object', pathSimpleObjectTestData, path.simple.object as any)

createSerializerTest('path.label.primitive', pathLabelPrimitiveTestData, path.label.primitive as any)
createSerializerTest('path.label.array', pathLabelArrayTestData, path.label.array as any)
createSerializerTest('path.label.object', pathLabelObjectTestData, path.label.object as any)

createSerializerTest('path.matrix.primitive', pathMatrixPrimitiveTestData, path.matrix.primitive as any)
createSerializerTest('path.matrix.array', pathMatrixArrayTestData, path.matrix.array as any)
createSerializerTest('path.matrix.object', pathMatrixObjectTestData, path.matrix.object as any)
