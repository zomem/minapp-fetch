import {PLATFORM_NAME} from '../constants/constants'
import {PLATFORM_ERROR, WEBAPI_OPTIONS_ERROR, GEO_POLYGON_ERROR} from '../constants/error'
import {IGetBaaSF, THeader} from '../types'

//根据平台，返回请求方式， BaaS/axios
export function getBaaSF():IGetBaaSF{
  let tempMinapp: IGetBaaSF = {BaaS_F: '', minapp: 'zx_cloud'}
  if(typeof(window) !== 'undefined'){
    if(window.MINAPP){
      tempMinapp.minapp = window.MINAPP
      switch(tempMinapp.minapp){
        case PLATFORM_NAME.ZX_WEB:
          tempMinapp.BaaS_F = window.BaaS
          break
        case PLATFORM_NAME.ZX_OP:
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          break
        case PLATFORM_NAME.ZX_WEBAPI:
          let options = window.MINAPP_OPTIONS
          if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
          let Header: THeader = {
            'Content-Type': 'application/json',
            'X-Hydrogen-Client-ID': options.clientID,
          }
          if(options.accessToken) Header['Authorization'] = `Hydrogen-r1 ${options.accessToken}`
          if(options.env) Header['X-Hydrogen-Env-ID'] = options.env
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          tempMinapp.options = {
            RequestBase: options.host || `https://${options.clientID}.myminapp.com`,
            Header: Header
          }
          break
        default:
          break
      }
    }
  }
  if(typeof(global) !== 'undefined'){
    if(global.MINAPP){
      tempMinapp.minapp = global.MINAPP
      switch(tempMinapp.minapp){
        case PLATFORM_NAME.ZX_CLOUD:
          // @ts-ignore：无法找到BaaS的错误
          tempMinapp.BaaS_F = BaaS
          break
        case PLATFORM_NAME.ZX_RN:
          tempMinapp.BaaS_F = global.BaaS
          break
        case PLATFORM_NAME.ZX_WEBAPI:
          let options = global.MINAPP_OPTIONS
          if(!options) throw new Error(WEBAPI_OPTIONS_ERROR)
          let Header: THeader = {
            'Content-Type': 'application/json',
            'X-Hydrogen-Client-ID': options.clientID,
          }
          if(options.accessToken) Header['Authorization'] = `Hydrogen-r1 ${options.accessToken}`
          if(options.env) Header['X-Hydrogen-Env-ID'] = options.env
          tempMinapp.BaaS_F = require('axios').create({withCredentials: true})
          tempMinapp.options = {
            RequestBase: options.host || `https://${options.clientID}.myminapp.com`,
            Header: Header
          }
          break
        case PLATFORM_NAME.WX_CLOUD:
          tempMinapp.BaaS_F = global.wxCloud
          break
        case PLATFORM_NAME.UNI_CLOUD:
          tempMinapp.BaaS_F = global.uniCloud
          break
        case PLATFORM_NAME.MONGODB:
          tempMinapp.BaaS_F = global.MongoDB
          if(!global.MINAPP_OPTIONS) throw new Error(WEBAPI_OPTIONS_ERROR)
          tempMinapp.options = global.MINAPP_OPTIONS
          break
        case PLATFORM_NAME.MYSQL:
          tempMinapp.BaaS_F = global.MySQL
          if(!global.MINAPP_OPTIONS) throw new Error(WEBAPI_OPTIONS_ERROR)
          tempMinapp.options = global.MINAPP_OPTIONS
        default:
          break
      }
    }
  }
  if(typeof(my) !== 'undefined'){
    if(my.MINAPP){
      tempMinapp.minapp = my.MINAPP
      tempMinapp.BaaS_F = my.BaaS
    }
  }
  if(typeof(jd) !== 'undefined'){
    if(jd.MINAPP){
      tempMinapp.minapp = jd.MINAPP
      tempMinapp.BaaS_F = jd.BaaS
    }
  }
  if(typeof(qq) !== 'undefined'){
    if(qq.MINAPP){
      tempMinapp.minapp = qq.MINAPP
      tempMinapp.BaaS_F = qq.BaaS
    }
  }
  if(typeof(swan) !== 'undefined'){
    if(swan.MINAPP){
      tempMinapp.minapp = swan.MINAPP
      tempMinapp.BaaS_F = swan.BaaS
    }
  }
  if(typeof(tt) !== 'undefined'){
    if(tt.MINAPP){
      tempMinapp.minapp = tt.MINAPP
      tempMinapp.BaaS_F = tt.BaaS
    }
  }
  if(typeof(wx) !== 'undefined'){
    if(wx.MINAPP){
      tempMinapp.minapp = wx.MINAPP
      switch(tempMinapp.minapp){
        case PLATFORM_NAME.ZX_WEAPP:
          tempMinapp.BaaS_F = wx.BaaS
          break
        case PLATFORM_NAME.WX_WEAPP:
          tempMinapp.BaaS_F = wx.cloud
          break
        default:
          break
      }
    }
  }
  if(!tempMinapp.BaaS_F) throw new Error(PLATFORM_ERROR)
  return tempMinapp
}


export const isJson = (value: any) => {
  return typeof(value) === 'object'
}
//isArray属于isJson
export const isArray = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Array]'
}
export const isNumber = (value: any) => {
  return typeof(value) === 'number' && !isNaN(value)
}

// 检查polygon是否对
const isPolygonArr = (arr: [number, number][]) => {
  if((arr.length < 4) || (arr[0][0] !== arr[arr.length-1][0]) || (arr[0][1] !== arr[arr.length-1][1])){
    throw new Error(GEO_POLYGON_ERROR)
  }else{
    return true
  }
}
// 目前仅支持对象或数字的拷贝
export const cloneDeep = (source: any) => {
  if (source === undefined || source === null) return Object.create(null)
  const target = isArray(source) ? [] : Object.create(Object.getPrototypeOf(source))
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        target[keys] = isArray(source[keys]) ? [] : {}
        target[keys] = cloneDeep(source[keys])
      } else {
        target[keys] = source[keys]
      }
    }
  }
  return target
}

// 返回新增的对象，geopoint化
export const changeSetParams = (params: any) => {
  let changeData = params
  for(let p in params){
    if(isArray(params[p])){
      if(params[p][0] === 'geo'){
        if(isArray(params[p][1])){
          let temp = params[p]
          temp.shift()
          if(temp.length > 1){
            isPolygonArr(temp)
            changeData[p] = cloneDeep({
              type: 'Polygon',
              coordinates: [temp]
            })
          }else{
            changeData[p] = cloneDeep({
              type: 'Point',
              coordinates: temp[0]
            })
          }
        }
      }
    }
  }
  return changeData
}

export const changeSetManyParams = (params: any) => {
  let change = []
  for(let i = 0; i < params.length; i++){
    change.push(changeSetParams(params[i]))
  }
  return change
}


// 返回geojson
export const changeFindGeoJson = (lparams: any) => {  //['point', 'include', [23, 32]]
  let temp = []  
  if(lparams[1] === 'within'){
    lparams.splice(0,2)
    isPolygonArr(lparams)
    temp = cloneDeep({
      type: 'Polygon',
      coordinates: [lparams]
    })
  }else{
    temp = cloneDeep({
      type: 'Point',
      coordinates: lparams[2]
    })
  }
  return temp
}


//mysql 链接池
export const mysqlConnect = (tempMinapp, sql, sqlArr, callback) => {
  let {BaaS_F, options} = tempMinapp
  let pool = BaaS_F.createPool({
    ...options
  })
  pool.getConnection((err, connection) => {
    if(err) throw new Error(err)
    connection.query(sql, sqlArr, callback)
    connection.release()
  })
}




