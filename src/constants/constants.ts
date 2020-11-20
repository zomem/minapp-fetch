/*
 * @Author: your name
 * @Date: 2020-05-18 18:02:23
 * @LastEditTime: 2020-06-06 08:45:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /@minappjs/weapp/src/constants/constants.ts
 */ 

export const PLATFORM_NAME = {
  ZX_ALIPAY: 'zx_alipay',
  ZX_CLOUD: 'zx_cloud',           //云函数
  ZX_JD: 'zx_jd',
  ZX_OP: 'zx_op',                 //运营后台
  ZX_QQ: 'zx_qq',                 
  ZX_RN: 'zx_rn',
  ZX_SWAN: 'zx_swan',             
  ZX_TT: 'zx_tt',
  ZX_WEAPP: 'zx_weapp',
  ZX_WEB: 'zx_web',
  ZX_WEBAPI: 'zx_webapi',

  WX_WEAPP: 'wx_weapp',     //微信云开发，微信小程序端
  WX_CLOUD: 'wx_cloud',      //微信云开发，云函数端

  UNI_CLOUD: 'uni_cloud',    //uniCloud云开发

  MONGODB: 'mongodb',     //MongoDB数据库
}

//知晓云 以BaaS方式请求的平台
export const PLATFORM_NAME_BAAS = [
  'zx_alipay',
  'zx_cloud',           //云函数
  'zx_qq',                 
  'zx_swan',             
  'zx_weapp',
  'zx_tt',
  'zx_jd',
  'zx_web',
  'zx_rn',
]

//知晓云 以axios请求的平台
export const PLATFORM_NAME_AXIOS = [
  'zx_op',                 //运营后台
  'zx_webapi',
]

//Mongod类数据库
export const PLATFORM_NAME_MONGO_SERVER = [
  'wx_weapp',
  'wx_cloud',
  'uni_cloud',
  'mongodb'
]

//所有平台
export const PLATFORM_ALL = [
  ...PLATFORM_NAME_BAAS,
  ...PLATFORM_NAME_AXIOS,
  ...PLATFORM_NAME_MONGO_SERVER,
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
  'currentDate',
]

