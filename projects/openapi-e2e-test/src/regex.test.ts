import { compile, pathToRegexp } from 'path-to-regexp'
// import { match, parse, pathToRegexp, regexpToFunction, tokensToFunction, tokensToRegexp } from 'path-to-regexp'

describe('regex', () => {
  it('should check the regex', () => {
    const x = compile('/foo/:frog/cat/:dog')
    console.log(x({ frog: 1, dog: 2 }))
  })
  it('should do more shit', () => {
    const r = pathToRegexp('/foo/:frog/cat/:dog/doggo:cate', [], {
      end: true,
      start: true,
      strict: true,
      sensitive: true,
    })
    console.log(r)
    const result = r.exec('/foo/;id=role,admin,firstName,Alex/cat/;id=3;id=4;id=5/doggo19')
    if (!result) {
      return
    }
    const array = []
    for (let i = 1; i < result.length; i++) {
      array[i-1] = result[i]
    }
    console.log(array)
  })
})
