/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:45:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/constants/constants.ts
 */ 

export const PLATFORM_NAME = {
  ALIPAY: 'alipay',
  CLOUD: 'cloud',           //云函数
  JD: 'jd',
  OP: 'op',                 //运营后台
  QQ: 'qq',                 
  RN: 'rn',
  SWAN: 'swan',             
  TT: 'tt',
  WEAPP: 'weapp',
  WEB: 'web',
  WEBAPI: 'webapi',
}

//以BaaS方式请求的平台
export const PLATFORM_NAME_BAAS = [
  'alipay',
  'cloud',           //云函数
  'qq',                 
  'swan',             
  'weapp',
  'tt',
  'jd',
  'web',
  'rn',
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

