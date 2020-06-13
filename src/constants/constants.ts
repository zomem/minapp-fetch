/*
 * @Author: your name
 * @Date: 2020-01-21 17:36:25
 * @LastEditTime: 2020-06-13 09:48:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /minapp-fetch/src/constants/constants.ts
 */ 

export const PLATFORM_NAME = {
  ALIPAY: 'alipay',
  CLOUD: 'cloud',           //云函数
  OP: 'op',                 //运营后台
  QQ: 'qq',                 
  SWAN: 'swan',             
  WEAPP: 'weapp',
  TT: 'tt',
  JD: 'jd',
  WEB: 'web',
  RN: 'rn',
  WEBAPI: 'webapi',
}

export const PLATFORM_NAME_ARR = [
  'alipay',
  'cloud',           //云函数
  'op',                 //运营后台
  'qq',                 
  'swan',             
  'weapp',
  'tt',
  'jd',
  'web',
  'rn',
  'webapi',
]

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

