const minapp = require('../lib/index').init('tt')

minapp.loginWith()

minapp.update('ssss', 'fff', {
  name: 'sett',
  age: ['incr', 32],
  time: ['append', [3, 323]],
  geo: ['geo', [3, 23]]
})

