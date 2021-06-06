import { header } from '..'
import { createSerializerTest } from '../testUtils'
import {
  headerSimpleArrayTestData,
  headerSimpleObjectTestData,
  headerSimplePrimitiveTestData,
} from './headerSerializers.testdata'

createSerializerTest('header.simple.primitive', headerSimplePrimitiveTestData, header.simple.primitive)
createSerializerTest('header.simple.array', headerSimpleArrayTestData, header.simple.array)
createSerializerTest('header.simple.object', headerSimpleObjectTestData, header.simple.object)
