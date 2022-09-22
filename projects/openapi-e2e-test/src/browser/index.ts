const mocha = require('mocha')

mocha.setup('bdd')

require('./parameters.test')

mocha.run()
