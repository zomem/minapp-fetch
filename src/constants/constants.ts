
export const PLATFORM_NAME = {
  ALIPAY: 'alipay',
  CLOUD: 'cloud',           //云函数
  OP: 'op',                 //运营后台
  QQ: 'qq',                 
  SWAN: 'swan',             
  WEAPP: 'weapp',
  WEB: 'web',
  WEBAPI: 'webapi',
  DEFAULT: 'default'
}

export const PLATFORM_NAME_ARR = [
  'alipay',
  'cloud',           //云函数
  'op',                 //运营后台
  'qq',                 
  'swan',             
  'weapp',
  'web',
  'webapi',
  'default',
]

//以BaaS方式请求的平台
export const PLATFORM_NAME_BAAS = [
  'alipay',
  'cloud',           //云函数
  'qq',                 
  'swan',             
  'weapp',
  'web',
  'default',
]

//以axios请求的平台
export const PLATFORM_NAME_AXIOS = [
  'op',                 //运营后台
  'webapi',
]

//更新数据的方法
export const UPDATE_METHORD = [
  'incr',
  'set',
  'geo',
  'unset',
  'append',
  'remove',
  'uAppend',
  'patchObject',
]

