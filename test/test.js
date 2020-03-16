const minapp = require('../lib/index').init('weapp')

minapp.update('ssss', 'fff', {
  name: 'sett',
  age: ['incr', 32],
  time: ['append', [3, 323]],
  geo: ['geo', [3, 23]]
})

minapp.set('fff', {
  name: 'fff',
  geo: ['geo', [32, 32]],
  arry: ['fadf', '24']
})

minapp.getAsyncJobResult()