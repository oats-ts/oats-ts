const mocha = require('mocha')

mocha.setup({
  slow: 0,
  timeout: '5000',
  ui: 'bdd',
  inlineDiffs: true,
  diff: true,
  fullTrace: true,
})

require('./parameters.test')
require('./methods.test')

mocha.run()
