const mocha = require('mocha')

mocha.setup({
  retries: 3,
  timeout: '5000',
  ui: 'bdd',
  inlineDiffs: true,
})

require('./parameters.test')

mocha.run()
