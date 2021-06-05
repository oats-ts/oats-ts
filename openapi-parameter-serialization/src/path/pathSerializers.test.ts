import { path } from '..'
import { createSerializerTest } from '../testUtils'
import {
  pathLabelArrayTestData,
  pathLabelPrimitiveTestData,
  pathSimpleArrayTestData,
  pathSimpleObjectTestData,
  pathSimplePrimitiveTestData,
} from './pathSerializers.testdata'

createSerializerTest('path.simple.primitive', pathSimplePrimitiveTestData, path.simple.primitive)
createSerializerTest('path.simple.array', pathSimpleArrayTestData, path.simple.array)
createSerializerTest('path.simple.object', pathSimpleObjectTestData, path.simple.object)

createSerializerTest('path.label.primitive', pathLabelPrimitiveTestData, path.label.primitive)
createSerializerTest('path.label.array', pathLabelArrayTestData, path.label.array)
