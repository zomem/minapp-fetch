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

minapp.find('fff', {
  p0: ['stin', 'stringLength', 5, 23]
})

minapp.find('faff', {
  p4: ['3434', 'stringLength', 4]
})

minapp.find('faf', {
  p1: ['fadf', 'stringLength', 435, 324234]
})