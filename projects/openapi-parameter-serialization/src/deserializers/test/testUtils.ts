import {
  ObjectTypesObject,
  PrimitiveTypesObject,
  StyleObject,
  TestDataObject,
  TestFactory,
  TypesObject,
} from './testTypes'

function createPrimitiveTypesTests<F, D>(
  name: string,
  testFactory: TestFactory<F, D>,
  parsers: PrimitiveTypesObject<F>,
  data: PrimitiveTypesObject<D>,
) {
  if (parsers === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    testFactory('string', parsers.string!, data.string!)
    testFactory('number', parsers.number!, data.number!)
    testFactory('boolean', parsers.boolean!, data.boolean!)
    testFactory('literal', parsers.literal!, data.literal!)
    testFactory('enumeration', parsers.enumeration!, data.enumeration!)
  })
}

function createObjectTypesTests<F, D>(
  name: string,
  testFactory: TestFactory<F, D>,
  parsers: ObjectTypesObject<F>,
  data: ObjectTypesObject<D>,
) {
  if (parsers === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    testFactory('requiredFields', parsers.requiredFields!, data?.requiredFields!)
    testFactory('optionalFields', parsers.optionalFields!, data?.optionalFields!)
  })
}

function createTestsForPossibleTypes<F, D>(
  name: string,
  testFactory: TestFactory<F, D>,
  parsers: TypesObject<F>,
  data: TypesObject<D>,
): void {
  if (parsers === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    createPrimitiveTypesTests('primitves', testFactory, parsers.primitive!, data.primitive!)
    createPrimitiveTypesTests('array', testFactory, parsers.array!, data.array!)
    createObjectTypesTests('object', testFactory, parsers.object!, data.object!)
  })
}

function createStyleObjectTests<F, D>(
  name: string,
  testFactory: TestFactory<F, D>,
  parsers: StyleObject<F>,
  data: StyleObject<D>,
): void {
  if (parsers === undefined || data === undefined) {
    return
  }
  describe(name, () => {
    createTestsForPossibleTypes('required', testFactory, parsers.required!, data.required!)
    createTestsForPossibleTypes('optional', testFactory, parsers.optional!, data.optional!)
  })
}

export const createTestSuiteFactory =
  <F, D>(testFactory: TestFactory<F, D>) =>
  (name: string, parsers: TestDataObject<F>, data: TestDataObject<D>): void => {
    describe(name, () => {
      createStyleObjectTests('explode', testFactory, parsers.explode!, data.explode!)
      createStyleObjectTests('noExplode', testFactory, parsers.noExplode!, data.noExplode!)
    })
  }
