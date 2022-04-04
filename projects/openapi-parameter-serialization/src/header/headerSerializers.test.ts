import { header } from '.'
import { createSerializerTest } from '../testUtils'
import {
  headerSimpleArrayTestData,
  headerSimpleObjectTestData,
  headerSimplePrimitiveTestData,
} from './headerSerializers.testdata'

createSerializerTest('header.simple.primitive', headerSimplePrimitiveTestData, header.simple.primitive as any)
createSerializerTest('header.simple.array', headerSimpleArrayTestData, header.simple.array as any)
createSerializerTest('header.simple.object', headerSimpleObjectTestData, header.simple.object as any)
