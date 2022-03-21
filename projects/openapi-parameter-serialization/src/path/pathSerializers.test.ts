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

createSerializerTest('path.simple.primitive', pathSimplePrimitiveTestData, path.simple.primitive)
createSerializerTest('path.simple.array', pathSimpleArrayTestData, path.simple.array)
createSerializerTest('path.simple.object', pathSimpleObjectTestData, path.simple.object)

createSerializerTest('path.label.primitive', pathLabelPrimitiveTestData, path.label.primitive)
createSerializerTest('path.label.array', pathLabelArrayTestData, path.label.array)
createSerializerTest('path.label.object', pathLabelObjectTestData, path.label.object)

createSerializerTest('path.matrix.primitive', pathMatrixPrimitiveTestData, path.matrix.primitive)
createSerializerTest('path.matrix.array', pathMatrixArrayTestData, path.matrix.array)
createSerializerTest('path.matrix.object', pathMatrixObjectTestData, path.matrix.object)
