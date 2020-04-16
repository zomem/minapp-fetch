/*
 * @Author: your name
 * @Date: 2020-01-28 19:12:51
 * @LastEditTime: 2020-04-16 20:45:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/test/test.js
 */


const minapp = require('../lib/index').init('cloud')

minapp.setCategory(2234324, {
  name: 'asf',
  parent: '32423'
})

minapp.deleteContent()
minapp.setContent(3234, {
  categories: 234,
  content: '234234',
  description: '234234'
})