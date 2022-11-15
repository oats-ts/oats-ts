class NestedTest {
  field = { bar: 'bar', foo: 'foo' }

  get nested() {
    const outerField = this.field
    return {
      foo() {
        console.log(outerField.bar)
      },
      bar() {
        console.log(outerField.foo)
      },
    }
  }
}

describe('classTest', () => {
  it('should not throw', () => {
    const instance = new NestedTest()
    instance.nested.foo()
    instance.nested.bar()
  })
})
